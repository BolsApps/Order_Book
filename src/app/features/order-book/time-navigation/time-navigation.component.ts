import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position: relative; display: flex; align-items: center; gap: 10px;">
      <span>{{ currentTimeLabel }}</span>

      <div style="position: relative; flex-grow: 1;">
        <input
          #slider
          type="range"
          [min]="0"
          [max]="max - 1"
          [value]="index"
          (input)="onSliderChange($event)"
          (mousemove)="onMouseMove($event)"
          (mouseleave)="hideTooltip()"
          style="width: 100%;"
        />
        <div
          *ngIf="showTooltip"
          [style.left.px]="tooltipX"
          style="position: absolute; top: -28px; background: #333; color: white; padding: 2px 6px; font-size: 12px; border-radius: 4px; transform: translateX(-50%); pointer-events: none;"
        >
          {{ hoverTimeLabel }}
        </div>
      </div>

      <span>{{ index + 1 }} / {{ max }}</span>
    </div>
  `
})
export class TimeNavigationComponent {
  @Input() index!: number;
  @Input() max!: number;
  @Input() timestamps: string[] = [];
  @Input() useUtc = false;

  @Output() navigate = new EventEmitter<number>();

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLInputElement>;

  showTooltip = false;
  tooltipX = 0;
  hoverIndex = 0;

  get currentTimeLabel(): string {
    const ts = this.timestamps[this.index];
    return ts ? this.formatTime(ts) : '';
  }

  get hoverTimeLabel(): string {
    const ts = this.timestamps[this.hoverIndex];
    return ts ? this.formatTime(ts) : '';
  }

  
  private formatTime(ts: string): string {
    const [hms, micro] = ts.split('.');
    const milli = micro ? micro.slice(0, 3) : '000';
    const isoString = `2000-01-01T${hms}.${milli}`;
    const date = new Date(isoString);
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: this.useUtc ? 'UTC' : undefined
    });
  }
  
  /*
  private formatTime(ts: string): string {
    const [hms, micro] = ts.split('.');
    const milli = micro ? micro.slice(0, 3) : '000';
    const isoString = `2000-01-01T${hms}.${milli}`; // <--- bez Z
    const date = new Date(isoString);
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  */
  onSliderChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.navigate.emit(value);
  }

  onMouseMove(event: MouseEvent) {
    const slider = this.sliderRef.nativeElement;
    const rect = slider.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const idx = Math.round(percent * (this.max - 1));

    this.hoverIndex = Math.min(Math.max(idx, 0), this.max - 1);
    this.tooltipX = (percent * rect.width);
    this.showTooltip = true;
  }

  hideTooltip() {
    this.showTooltip = false;
  }
}
