import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner.html',
  styleUrls: ['./owner.css']
})
export class OwnerDashboard implements OnInit {
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

  ngOnInit() {
  }
}
