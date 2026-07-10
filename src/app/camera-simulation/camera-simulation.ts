import { Component, signal, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera-simulation',
  standalone: true,
  imports: [],
  templateUrl: './camera-simulation.html',
  styleUrl: './camera-simulation.css'
})
export class CameraSimulation implements OnInit, OnDestroy {
  private router = inject(Router);
  
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  isRegisterPage = signal(false);
  matchPercentage = signal(99.8);
  freeSpaces = signal(14);
  cctvTime = signal('');
  systemStatus = signal('ONLINE');
  detectionCount = signal(3);
  
  // AI Video Tracking
  hasVideo = signal(false);
  videoUrl = signal<string | null>(null);
  isTracking = signal(false);
  isOccupied = signal(false);
  
  boxLeft = signal(0);
  boxTop = signal(0);
  boxWidth = signal(0);
  boxHeight = signal(0);
  
  private intervalId: any;
  private aiIntervalId: any;
  
  private lastCx = 0;
  private lastCy = 0;
  private staticFrames = 0;

  ngOnInit() {
    this.isRegisterPage.set(this.router.url.includes('register'));
    this.updateClock();
    
    this.intervalId = setInterval(() => {
      this.updateClock();
      const newRate = +(99.0 + Math.random() * 0.9).toFixed(1);
      this.matchPercentage.set(newRate);
      
      if (!this.hasVideo() && Math.random() > 0.7) {
        const diff = Math.random() > 0.5 ? 1 : -1;
        const nextSpaces = Math.max(8, Math.min(22, this.freeSpaces() + diff));
        this.freeSpaces.set(nextSpaces);
      }
    }, 2500);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.aiIntervalId) clearInterval(this.aiIntervalId);
    if (this.videoUrl()) URL.revokeObjectURL(this.videoUrl()!);
  }

  private updateClock() {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    this.cctvTime.set(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.videoUrl()) URL.revokeObjectURL(this.videoUrl()!);
      this.videoUrl.set(URL.createObjectURL(file));
      this.hasVideo.set(true);
      this.isOccupied.set(false);
      this.isTracking.set(false);
      this.staticFrames = 0;
      this.systemStatus.set('ANALIZANDO VIDEO...');
      
      if (this.aiIntervalId) clearInterval(this.aiIntervalId);
      this.aiIntervalId = setInterval(() => this.processVideoFrame(), 500);
    }
  }

  processVideoFrame() {
    if (!this.videoPlayer || !this.videoPlayer.nativeElement || this.isOccupied()) return;
    
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
        const result = await response.json();
        
        if (result.detections && result.detections.length > 0) {
          const target = result.detections.sort((a:any, b:any) => 
            (b.bounding_box.w * b.bounding_box.h) - (a.bounding_box.w * a.bounding_box.h)
          )[0].bounding_box;
          
          const vw = canvas.width;
          const vh = canvas.height;
          
          this.isTracking.set(true);
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
            this.isOccupied.set(true);
            this.isTracking.set(false);
            this.systemStatus.set('ESPACIO OCUPADO');
            this.freeSpaces.update((s: number) => s - 1);
            if (this.aiIntervalId) clearInterval(this.aiIntervalId);
          }
        } else {
          this.isTracking.set(false);
        }
      } catch (e) {
        console.error('YOLO AI Error:', e);
      }
    }, 'image/jpeg', 0.8);
  }
}
