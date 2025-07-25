import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseClaimService } from '../../../services/expense-claim';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-employee-claims',
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-claims.html',
  styleUrl: './employee-claims.css',
})
export class EmployeeClaims {
  employeeId!: any;
  claimDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private expenseLeaveService: ExpenseClaimService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;

    this.fetchEmployeeClaims();
  }

  fetchEmployeeClaims() {
    this.expenseLeaveService
      .getAllClaimsByEmployeeId(this.employeeId)
      .subscribe({
        next: (result: any) => {
          this.claimDetails = result.data;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error loading details:', error);
        },
      });
  }

  goBack() {
    this.router.navigate(['/expense-claims']);
  }
}
