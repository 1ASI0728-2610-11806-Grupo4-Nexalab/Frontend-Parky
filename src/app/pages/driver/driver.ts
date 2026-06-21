import { Component, AfterViewInit, ElementRef, ViewChild, NgZone, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { DataService } from '../../services/data.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver.html',
  styleUrls: ['./driver.css']
})
export class DriverDashboard implements AfterViewInit {
  @ViewChild('map') mapContainer!: ElementRef;
  private map!: L.Map;
  private tileLayer!: L.TileLayer;

  showOverlay = false;
  selectedGarage: any = null;

  constructor(
    private dataService: DataService, 
    private ngZone: NgZone, 
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      this.updateMapTheme(isDark);
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  updateMapTheme(isDark: boolean) {
    if (!this.map) return;
    
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    this.tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false
    }).setView([-12.0945, -77.0310], 15); // San Isidro, Lima

    this.updateMapTheme(this.themeService.isDarkMode());

    this.addMarkers();
  }

  private addMarkers() {
    const garages = this.dataService.garages();

    // Create a custom icon with price label
    const createCustomIcon = (price: number, isSelected: boolean) => {
      return L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div class="custom-marker ${isSelected ? 'selected' : ''}">
            <span class="price">$${price}/h</span>
            <div class="marker-dot"></div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 60]
      });
    };

    garages.forEach(garage => {
      const marker = L.marker([garage.coordinates.lat, garage.coordinates.lng], {
        icon: createCustomIcon(garage.pricePerHour, false)
      }).addTo(this.map);

      marker.on('click', () => {
        this.ngZone.run(() => {
          this.selectedGarage = garage;
          this.showOverlay = true;
          // Optionally center map
          this.map.setView([garage.coordinates.lat, garage.coordinates.lng], 16);
          
          // Update all icons to unselected, then this one to selected
          this.map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
               const g = garages.find(x => x.coordinates.lat === layer.getLatLng().lat && x.coordinates.lng === layer.getLatLng().lng);
               if (g) {
                 layer.setIcon(createCustomIcon(g.pricePerHour, g.id === garage.id));
               }
            }
          });
          
          // Force change detection update
          this.cdr.detectChanges();
        });
      });
    });
  }

  closeOverlay() {
    this.showOverlay = false;
    this.selectedGarage = null;
    
    // Reset icons
    const garages = this.dataService.garages();
    const createCustomIcon = (price: number) => {
      return L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div class="custom-marker">
            <span class="price">$${price}/h</span>
            <div class="marker-dot"></div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 60]
      });
    };

    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
         const g = garages.find(x => x.coordinates.lat === layer.getLatLng().lat && x.coordinates.lng === layer.getLatLng().lng);
         if (g) {
           layer.setIcon(createCustomIcon(g.pricePerHour));
         }
      }
    });
  }
}
