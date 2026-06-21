import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-panel.html',
  styleUrls: ['./chat-panel.css']
})
export class ChatPanel {
  @Input() mode: 'conductor' | 'propietario' = 'conductor';
  isCollapsed = false;
  message = '';
  
  constructor(public dataService: DataService) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
