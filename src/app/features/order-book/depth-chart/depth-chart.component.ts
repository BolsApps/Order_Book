import {
  Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import { OrderBookSnapshot } from '../../../shared/models/order-book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depth-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<svg #chart width="800" height="600"></svg>'
})
export class DepthChartComponent implements OnChanges {
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
    const width = 800;
    const height = 600;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const sortedBids = [...this.snapshot.bids].sort((a, b) => b.price - a.price);
    const sortedAsks = [...this.snapshot.asks].sort((a, b) => a.price - b.price);

    const cumulativeBids = sortedBids.reduce((acc, level) => {
      const last = acc.length > 0 ? acc[acc.length - 1].size : 0;
      acc.push({ price: level.price, size: last + level.size });
      return acc;
    }, [] as { price: number; size: number }[]);

    const cumulativeAsks = sortedAsks.reduce((acc, level) => {
      const last = acc.length > 0 ? acc[acc.length - 1].size : 0;
      acc.push({ price: level.price, size: last + level.size });
      return acc;
    }, [] as { price: number; size: number }[]);

    const x = d3.scaleLinear()
      .domain(d3.extent([...cumulativeBids, ...cumulativeAsks], d => d.price) as [number, number])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max([...cumulativeBids, ...cumulativeAsks], d => d.size)!])
      .range([innerHeight, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));

    const line = d3.line<{ price: number; size: number }>()
      .x(d => x(d.price))
      .y(d => y(d.size));

    g.append('path')
      .datum(cumulativeBids)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('d', line);

    g.append('path')
      .datum(cumulativeAsks)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 2)
      .attr('d', line);

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom)
      .attr('text-anchor', 'middle')
      .text('Price');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 10)
      .attr('text-anchor', 'middle')
      .text('Cumulative Size');
  }
}
