import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExpenseClaimService } from '../../services/expense-claim';
import { TotalExpensesByType } from '../../models/ExpenseClaimModel';
import { TotalLeavesByType } from '../../models/Leave.model';
import { LeaveService } from '../../services/leave';
import { BarChart } from './bar-chart/bar-chart';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BarChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  expenseTypeTotals: TotalExpensesByType[] = [];
  leaveTypeTotals: TotalLeavesByType[] = [];

  maxExpenseValue = 0;
  maxLeaveValue = 0;

  constructor(
    private expenseClaimService: ExpenseClaimService,
    private leaveService: LeaveService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchExpenseTotals();
    this.fetchLeaveTotals();
  }

  fetchExpenseTotals() {
    this.expenseClaimService.getExpenseTotalsByType().subscribe({
      next: (data) => {
        this.expenseTypeTotals = data;
        this.maxExpenseValue = Math.max(
          ...data.map((item) => item.totalAmount)
        );

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load totals by type:', err);
      },
    });
  }

  fetchLeaveTotals() {
    this.leaveService.getLeaveTotalsByType().subscribe({
      next: (data) => {
        this.leaveTypeTotals = data;
        this.maxLeaveValue = Math.max(...data.map((item) => +item.totalDays));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load leave totals:', err);
      },
    });
  }

  get leaveChartData() {
    return (
      this.leaveTypeTotals?.map((item) => ({
        type: item.type,
        value: +item.totalDays,
      })) || []
    );
  }

  get expenseChartData() {
    return (
      this.expenseTypeTotals?.map((item) => ({
        type: item.type,
        value: +item.totalAmount,
      })) || []
    );
  }
}
