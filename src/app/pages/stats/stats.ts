import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class StatsView {
  // Mock Data for charts
  weeklyData = [
    { day: 'Lun', value: 45, height: '45%' },
    { day: 'Mar', value: 30, height: '30%' },
    { day: 'Mié', value: 65, height: '65%' },
    { day: 'Jue', value: 40, height: '40%' },
    { day: 'Vie', value: 85, height: '85%' },
    { day: 'Sáb', value: 120, height: '100%' }, // Max height
    { day: 'Dom', value: 100, height: '83%' }
  ];

  reviews = [
    { name: 'Carlos Mendoza', rating: 5, date: 'Hace 2 días', comment: 'Excelente cochera, muy segura y fácil de acceder con el portón automático.' },
    { name: 'Ana Salazar', rating: 4, date: 'Hace 1 semana', comment: 'Buena ubicación, aunque el espacio es un poco justo para camionetas grandes.' },
    { name: 'Luis R.', rating: 5, date: 'Hace 2 semanas', comment: 'Impecable. La IA me guió directo al espacio libre.' }
  ];
}
