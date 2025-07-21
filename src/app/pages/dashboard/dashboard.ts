import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  leaveData = [
    { type: 'Sick Leave', count: 5 },
    { type: 'Vacation', count: 10 },
    { type: 'Emergency', count: 3 },
    { type: 'Other', count: 2 },
  ];

  get maxCount(): number {
    return Math.max(...this.leaveData.map((d) => d.count));
  }
}
