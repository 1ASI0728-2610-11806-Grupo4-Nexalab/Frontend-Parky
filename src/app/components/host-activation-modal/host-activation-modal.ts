import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-activation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-activation-modal.html',
  styleUrls: ['./host-activation-modal.css']
})
export class HostActivationModal {
  @Output() close = new EventEmitter<void>();
  @Output() activated = new EventEmitter<void>();

  activateHost() {
    this.activated.emit();
    this.close.emit();
  }
}
