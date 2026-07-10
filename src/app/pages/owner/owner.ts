import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService, VisionResponse, Detection } from '../../services/ai.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner.html',
  styleUrls: ['./owner.css']
})
export class OwnerDashboard implements OnInit {
  private aiService = inject(AiService);

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

  ngOnInit() {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous states
    this.errorMessage.set(null);
    this.aiResult.set(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Run AI analysis
    this.uploadAndAnalyze(file);
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
}
