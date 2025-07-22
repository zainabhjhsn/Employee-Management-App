import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart {
  @Input() data: any[] = [];
  @Input() title: string = '';
  @Input() maxValue: number = 0;

  getMaxValue(): number {
    return this.maxValue || Math.max(...this.data.map((item) => item.value), 1);
  }
}
