import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { OrderBookComponent } from './order-book.component';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';
import { TimeNavigationComponent } from './time-navigation/time-navigation.component';
import { ReplayControlsComponent } from './replay-controls/replay-controls.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    //OrderBookComponent,
    //TimeNavigationComponent,
    //ReplayControlsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    OrderBookChartComponent,
    OrderBookComponent,
    TimeNavigationComponent,
    ReplayControlsComponent
  ],
  exports: [OrderBookComponent]
})
export class OrderBookModule {}
