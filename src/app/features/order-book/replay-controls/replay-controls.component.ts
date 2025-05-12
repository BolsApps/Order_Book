import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderBookService } from '../../../core/services/order-book.service';

@Component({
  selector: 'app-replay-controls',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    OrderBookService
  ],
  template: `
    <button (click)="togglePlay.emit()">{{ playing ? 'Pause' : 'Play' }}</button>
  `
})
export class ReplayControlsComponent {
  @Input() playing!: boolean; // Tutaj definiujemy właściwość 'playing' jako Input
  @Output() togglePlay = new EventEmitter<void>();
}