import { Component, OnInit, OnDestroy, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService, VisionResponse } from '../../services/ai.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner.html',
  styleUrls: ['./owner.css']
})
export class OwnerDashboard implements OnInit, OnDestroy {
  private aiService = inject(AiService);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  weeklyData = [
    { day: 'Lun', value: 45 },
    { day: 'Mar', value: 30 },
    { day: 'Mié', value: 60 },
    { day: 'Jue', value: 40 },
    { day: 'Vie', value: 75 },
    { day: 'Sáb', value: 110 },
    { day: 'Dom', value: 90 }
  ];

  maxWeeklyValue = 120;

  // AI Simulation States
  isAnalyzing = signal(false);
  previewUrl = signal<string | null>(null);
  aiResult = signal<VisionResponse | null>(null);
  errorMessage = signal<string | null>(null);

  // Video AI Tracking
  hasVideo = signal(false);
  isVideoTracking = signal(false);
  boxLeft = signal(0);
  boxTop = signal(0);
  boxWidth = signal(0);
  boxHeight = signal(0);
  
  private aiIntervalId: any;
  private lastCx = 0;
  private lastCy = 0;
  private staticFrames = 0;

  ngOnInit() {}

  ngOnDestroy() {
    if (this.aiIntervalId) clearInterval(this.aiIntervalId);
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Reset states
    this.errorMessage.set(null);
    this.aiResult.set(null);
    if (this.aiIntervalId) clearInterval(this.aiIntervalId);
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);

    if (file.type.startsWith('video/')) {
      this.hasVideo.set(true);
      this.isVideoTracking.set(false);
      this.previewUrl.set(URL.createObjectURL(file));
      this.staticFrames = 0;
      this.isAnalyzing.set(true); // show generic analyzing badge
      
      this.aiIntervalId = setInterval(() => this.processVideoFrame(), 500);
    } else {
      this.hasVideo.set(false);
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Run single image analysis
      this.uploadAndAnalyze(file);
    }
  }

  uploadAndAnalyze(file: File) {
    this.isAnalyzing.set(true);

    this.aiService.analyzeImage(file).subscribe({
      next: (res) => {
        this.aiResult.set(res);
        this.isAnalyzing.set(false);
      },
      error: (err) => {
        console.error('Error analyzing image:', err);
        this.errorMessage.set('Error al conectar con el servidor de IA.');
        this.isAnalyzing.set(false);
      }
    });
  }

  async processVideoFrame() {
    if (!this.videoPlayer || !this.videoPlayer.nativeElement) return;
    
    const video = this.videoPlayer.nativeElement;
    if (video.paused || video.ended) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/cv/analyze-image', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) return;
        const result: VisionResponse = await response.json();
        
        // Update dashboard result text
        this.aiResult.set(result);
        
        if (result.detections && result.detections.length > 0) {
          const target = result.detections.sort((a:any, b:any) => 
            (b.bounding_box.w * b.bounding_box.h) - (a.bounding_box.w * a.bounding_box.h)
          )[0].bounding_box;
          
          const vw = canvas.width;
          const vh = canvas.height;
          
          this.isVideoTracking.set(true);
          this.boxLeft.set((target.x / vw) * 100);
          this.boxTop.set((target.y / vh) * 100);
          this.boxWidth.set((target.w / vw) * 100);
          this.boxHeight.set((target.h / vh) * 100);
          
          const cx = target.x + (target.w / 2);
          const cy = target.y + (target.h / 2);
          const dx = Math.abs(cx - this.lastCx);
          const dy = Math.abs(cy - this.lastCy);
          
          if (dx < (vw * 0.02) && dy < (vh * 0.02)) {
            this.staticFrames++;
          } else {
            this.staticFrames = 0;
          }
          
          this.lastCx = cx;
          this.lastCy = cy;
          
          if (this.staticFrames >= 3) {
            this.isVideoTracking.set(false);
            if (this.aiIntervalId) clearInterval(this.aiIntervalId);
            this.isAnalyzing.set(false);
          }
        } else {
          this.isVideoTracking.set(false);
        }
      } catch (e) {
        console.error('YOLO AI Error:', e);
      }
    }, 'image/jpeg', 0.8);
  }
}
