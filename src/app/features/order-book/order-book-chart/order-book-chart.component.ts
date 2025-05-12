import {
  Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import { OrderBookSnapshot } from '../../../shared/models/order-book.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderBookService } from '../../../core/services/order-book.service';

@Component({
  selector: 'app-order-book-chart',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    OrderBookService
  ],
  template: '<svg #chart width="800" height="600"></svg>'
})
export class OrderBookChartComponent implements OnChanges {
  @Input() snapshot!: OrderBookSnapshot;
  @ViewChild('chart', { static: true }) chartElement!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['snapshot']) {
      this.renderChart();
    }
  }

  renderChart() {
    const svg = d3.select(this.chartElement.nativeElement);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };

    const bids = this.snapshot.bids.slice(0, 10);
    const asks = this.snapshot.asks.slice(0, 10);

    const allPrices = [...bids, ...asks].map(d => d.price).sort((a, b) => b - a);
    const uniquePrices = [...new Set(allPrices)];

    const barHeight = 15;
    const height = barHeight * uniquePrices.length + margin.top + margin.bottom;
    const width = 800;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('height', height).attr('width', width);

    const y = d3.scaleBand()
      .domain(uniquePrices.map(String))
      .range([0, innerHeight])
      .padding(0.1);

    const maxBidSize = d3.max(bids, d => d.size) || 0;
    const maxAskSize = d3.max(asks, d => d.size) || 0;

    const x = d3.scaleLinear()
      .domain([-maxBidSize * 1.1, maxAskSize * 1.1])
      .range([0, innerWidth]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .call(d3.axisLeft(y));
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text('Price');

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5));
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Size');

    g.selectAll('.bid')
      .data(bids)
      .enter()
      .append('rect')
      .attr('class', 'bid')
      .attr('y', d => y(String(d.price))!)
      .attr('x', d => x(-d.size))
      .attr('height', y.bandwidth())
      .attr('width', d => x(0) - x(-d.size))
      .attr('fill', 'blue');

    g.selectAll('.ask')
      .data(asks)
      .enter()
      .append('rect')
      .attr('class', 'ask')
      .attr('y', d => y(String(d.price))!)
      .attr('x', x(0))
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.size) - x(0))
      .attr('fill', 'orange');

    g.append('line')
      .attr('x1', x(0))
      .attr('y1', 0)
      .attr('x2', x(0))
      .attr('y2', innerHeight)
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  }


}