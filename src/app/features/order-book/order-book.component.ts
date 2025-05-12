import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderBookSnapshot } from '../../shared/models/order-book.model';
import { OrderBookService } from '../../core/services/order-book.service';
import { CommonModule } from '@angular/common';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';
import { TimeNavigationComponent } from './time-navigation/time-navigation.component';
import { ReplayControlsComponent } from './replay-controls/replay-controls.component';
import { HttpClientModule } from '@angular/common/http';
import { DepthChartComponent } from './depth-chart/depth-chart.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    OrderBookChartComponent,
    DepthChartComponent,
    TimeNavigationComponent,
    ReplayControlsComponent,
    FormsModule
  ],
  providers: [OrderBookService],
  template: `
    <div>
      <label>
        <input type="radio" [(ngModel)]="chartType" value="bars" /> Wykres słupkowy
      </label>
      <label>
        <input type="radio" [(ngModel)]="chartType" value="depth" /> Depth Chart
      </label>
    </div>

    <div>
      <label>
        <input type="checkbox" [(ngModel)]="useUtc" />
        Pokaż czas jako UTC
      </label>
      <small style="color: gray;">
        Czas w danych to czas lokalny sesji (Warszawa). Zaznacz, aby wyświetlić w UTC.
      </small>
    </div>

    <ng-container [ngSwitch]="chartType">
      <app-order-book-chart *ngSwitchCase="'bars'" [snapshot]="currentSnapshot"></app-order-book-chart>
      <app-depth-chart *ngSwitchCase="'depth'" [snapshot]="currentSnapshot"></app-depth-chart>
    </ng-container>

    <app-time-navigation
      [index]="index"
      [max]="snapshots.length"
      [timestamps]="timestamps"
      [useUtc]="useUtc"
      (navigate)="onNavigate($event)"
    ></app-time-navigation>


    <app-replay-controls [playing]="playing" (togglePlay)="toggleReplay()"></app-replay-controls>
  `
})
export class OrderBookComponent implements OnInit, OnDestroy {
  snapshots: OrderBookSnapshot[] = [];
  index = 0;
  playing = false;
  chartType: 'bars' | 'depth' = 'bars';
  private intervalId: any;
  timestamps: string[] = [];
  useUtc = false;

  constructor(private orderBookService: OrderBookService) {}

  ngOnInit() {
  this.orderBookService.getSnapshots().subscribe(snapshots => {
    this.snapshots = snapshots;
    this.timestamps = snapshots.map(s => s.timestamp);
  });
}

  get currentSnapshot() {
    return this.snapshots[this.index];
  }

  onNavigate(newIndex: number) {
    this.index = newIndex;
  }

  toggleReplay() {
    this.playing = !this.playing;
    if (this.playing) {
      this.playLoop();
    } else {
      clearTimeout(this.intervalId);
    }
  }

  playLoop() {
    if (this.index >= this.snapshots.length - 1) this.index = 0;

    const timeDiffs = this.snapshots.map((s, i, arr) =>
      i > 0 ? +new Date(s.timestamp) - +new Date(arr[i - 1].timestamp) : 0
    );
    const totalTime = 30000; // 30 sek.
    const totalDiff = timeDiffs.reduce((a, b) => a + b);
    const intervals = timeDiffs.map(diff => (diff / totalDiff) * totalTime);

    let i = this.index;
    const next = () => {
      if (i >= this.snapshots.length - 1) {
        this.playing = false;
        return;
      }
      this.index = ++i;
      this.intervalId = setTimeout(next, intervals[i]);
    };
    next();
  }

  ngOnDestroy() {
    clearTimeout(this.intervalId);
  }
}
