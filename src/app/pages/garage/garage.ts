import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Garage } from '../../services/data.service';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garage.html',
  styleUrls: ['./garage.css']
})
export class GarageView implements OnInit {
  myGarage: Garage | null = null;
  
  availableFeatures = [
    { id: 'f1', label: 'Cámara IA', icon: 'videocam' },
    { id: 'f2', label: 'Techado', icon: 'roofing' },
    { id: 'f3', label: 'Seguridad 24/7', icon: 'local_police' },
    { id: 'f4', label: 'Portón Eléctrico', icon: 'door_sliding' },
    { id: 'f5', label: 'Punto de Carga EV', icon: 'ev_station' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Mock user Laura G. is 'u2' who owns garages
    const allGarages = this.dataService.garages();
    this.myGarage = allGarages.find(g => g.ownerId === 'u2') || null;
  }

  toggleAvailability() {
    if (this.myGarage) {
      this.myGarage.isAvailable = !this.myGarage.isAvailable;
    }
  }

  hasFeature(featureLabel: string): boolean {
    return this.myGarage?.features.includes(featureLabel) || false;
  }

  toggleFeature(featureLabel: string) {
    if (!this.myGarage) return;
    
    const index = this.myGarage.features.indexOf(featureLabel);
    if (index > -1) {
      this.myGarage.features.splice(index, 1);
    } else {
      this.myGarage.features.push(featureLabel);
    }
  }
}
