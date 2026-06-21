import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
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
  
  isRegisterPage = signal(false);
  matchPercentage = signal(99.8);
  freeSpaces = signal(14);
  cctvTime = signal('');
  systemStatus = signal('ONLINE');
  detectionCount = signal(3);
  
  private intervalId: any;

  ngOnInit() {
    this.isRegisterPage.set(this.router.url.includes('register'));
    this.updateClock();
    
    // Update data every 2-3 seconds to simulate dynamic feed tracking
    this.intervalId = setInterval(() => {
      this.updateClock();
      
      // Randomize match rate between 99.1% and 99.9%
      const newRate = +(99.0 + Math.random() * 0.9).toFixed(1);
      this.matchPercentage.set(newRate);
      
      // Flickering active spaces slightly
      if (Math.random() > 0.7) {
        const diff = Math.random() > 0.5 ? 1 : -1;
        const nextSpaces = Math.max(8, Math.min(22, this.freeSpaces() + diff));
        this.freeSpaces.set(nextSpaces);
      }
      
      // Fluctuate detection count
      if (Math.random() > 0.6) {
        this.detectionCount.set(Math.random() > 0.5 ? 4 : 3);
      }
      
    }, 2500);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateClock() {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    this.cctvTime.set(timeStr);
  }
}
