import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService, User, Vehicle } from '../../services/data.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileView implements OnInit {
  user!: User;
  vehicles: Vehicle[] = [];
  activeTab = 'vehiculos';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.user = this.dataService.currentUser()!;
    if (this.user) {
      this.vehicles = this.dataService.getUserVehicles(this.user.id);
    }
  }

  switchMode(mode: 'conductor' | 'propietario') {
    if (mode === 'conductor') {
      this.router.navigate(['/driver']);
    } else {
      this.router.navigate(['/owner']);
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
