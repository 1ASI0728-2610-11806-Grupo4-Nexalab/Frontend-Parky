import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Sidebar } from '../../components/sidebar/sidebar';
import { ChatPanel } from '../../components/chat-panel/chat-panel';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, ChatPanel],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayout {
  @Input() mode: 'conductor' | 'propietario' = 'conductor';
  showFloatingChat = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.mode = event.urlAfterRedirects.includes('/owner') ? 'propietario' : 'conductor';
      this.showFloatingChat = event.urlAfterRedirects === '/driver' || event.urlAfterRedirects === '/owner';
    });
    
    // Initial check
    this.mode = this.router.url.includes('/owner') ? 'propietario' : 'conductor';
    this.showFloatingChat = this.router.url === '/driver' || this.router.url === '/owner';
  }
}
