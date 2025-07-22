import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeaveService } from '../../../services/leave';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-leaves',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-leaves.html',
  styleUrl: './employee-leaves.css',
})
export class EmployeeLeaves implements OnInit {
  employeeId!: any;
  leaves: any[] = [];

  fromDate: string = '';
  toDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private leaveService: LeaveService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;
    this.fetchEmployeeLeaves();
  }

  fetchEmployeeLeaves(from?: string, to?: string) {
    this.leaveService
      .getLeavesByEmployeeId(this.employeeId, from, to)
      .subscribe({
        next: (result: any) => {
          this.leaves = result.data;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error loading leaves:', error);
        },
      });
  }

  applyFilter() {
    this.fetchEmployeeLeaves(this.fromDate, this.toDate);
  }

  goBack() {
    this.router.navigate(['/leave']);
  }
}
