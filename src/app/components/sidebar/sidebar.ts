import { Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HostActivationModal } from '../host-activation-modal/host-activation-modal';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HostActivationModal],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnChanges, OnInit {
  @Input() mode: 'conductor' | 'propietario' = 'conductor';

  isHostModalOpen = false;
  isHostActivated = false;
  showToast = false;
  menuItems: any[] = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef, public dataService: DataService) {}

  ngOnInit() {
    this.updateMenuItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      this.updateMenuItems();
    }
  }

  updateMenuItems() {
    if (this.mode === 'conductor') {
      this.menuItems = [
        { label: 'Buscar Cochera', icon: 'search', path: '/driver' },
        { label: 'Mis Reservas', icon: 'calendar_today', path: '/driver/reservations' },
        { label: 'Mensajes', icon: 'chat', path: '/driver/messages' },
        { label: 'Configuración', icon: 'settings', path: '/driver/settings' },
        { label: 'Perfil', icon: 'person', path: '/profile' }
      ];
    } else {
      this.menuItems = [
        { label: 'Panel de Ingresos', icon: 'dashboard', path: '/owner' },
        { label: 'Mi Cochera', icon: 'home', path: '/owner/garage' },
        { label: 'Estadísticas', icon: 'bar_chart', path: '/owner/stats' },
        { label: 'Mensajes', icon: 'chat', path: '/owner/messages' },
        { label: 'Configuración', icon: 'settings', path: '/owner/settings' },
        { label: 'Perfil', icon: 'person', path: '/owner/profile' }
      ];
    }
  }

  openHostPromo() {
    if (this.isHostActivated) {
      if (this.mode === 'propietario') {
        this.router.navigate(['/driver']);
      } else {
        this.router.navigate(['/owner']);
      }
    } else {
      this.isHostModalOpen = true;
    }
  }

  onHostActivated() {
    this.isHostModalOpen = false;
    this.isHostActivated = true;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
