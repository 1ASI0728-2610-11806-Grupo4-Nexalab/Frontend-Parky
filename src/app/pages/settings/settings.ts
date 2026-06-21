import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsView {
  profile = { name: '', email: '', phone: '+51 987 654 321' };
  
  notifications = {
    newReservation: true,
    chatMessages: true,
    promotions: false,
    weeklyReport: true
  };

  payout = {
    bank: 'Banco BCP',
    accountNumber: '193-XXXXXXX-X-XX',
    autoWithdraw: true
  };

  isDriver = false;
  darkMode = false;

  constructor(
    private dataService: DataService, 
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    const user = this.dataService.currentUser();
    if (user) {
      this.profile.name = user.name;
      this.profile.email = user.email;
    }
    
    this.isDriver = this.router.url.includes('/driver');
    this.darkMode = this.themeService.isDarkMode();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.themeService.setDarkMode(this.darkMode);
  }

  saveSettings() {
    console.log('Settings saved', {
      profile: this.profile,
      payout: this.payout,
      notifications: this.notifications,
      darkMode: this.darkMode
    });
    alert('Configuración guardada exitosamente.');
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
