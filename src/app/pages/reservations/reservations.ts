import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Reservation, Garage } from '../../services/data.service';

interface EnrichedReservation extends Reservation {
  garage?: Garage;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class ReservationsView implements OnInit {
  reservations: EnrichedReservation[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Enrich reservations with garage details
    this.reservations = this.dataService.reservations().map((res: Reservation) => ({
      ...res,
      garage: this.dataService.getGarageById(res.garageId)
    }));
  }
}
