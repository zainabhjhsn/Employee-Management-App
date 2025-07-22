import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIResponseModel } from '../../models/Employee.model';
import { ExpenseClaimsTable } from './expense-claims-table/expense-claims-table';
import { ExpenseClaimService } from '../../services/expense-claim';

@Component({
  selector: 'app-expense-claims',
  imports: [RouterLink, CommonModule, FormsModule, ExpenseClaimsTable],
  templateUrl: './expense-claims.html',
  styleUrl: './expense-claims.css',
})
export class ExpenseClaims implements OnInit {
  isEmployee: boolean = false;
  currentTabName: string = 'claims';

  claimList: any[] = [];
  approvalClaimList: any[] = [];

  userRole: string = '';
  employeeId: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private expenseClaimService: ExpenseClaimService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isEmployee = this.authService.isEmployee();

    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.role;
      this.employeeId = user.employee_id;

      if (this.isAdmin) {
        this.loadAllExpenseClaims();
        this.loadExpenseClaimsForApproval();
      } else {
        this.loadClaimsByEmployeeId(this.employeeId);
      }
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  changeTab(tabName: string) {
    this.currentTabName = tabName;
  }

  loadAllExpenseClaims() {
    this.expenseClaimService.getAllClaims().subscribe({
      next: (result: any) => {
        this.claimList = result.data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      },
    });
  }

  loadExpenseClaimsForApproval() {
    this.expenseClaimService.getAllClaims().subscribe({
      next: (result: any) => {
        this.approvalClaimList = result.data.filter(
          (m: any) => m.status == 'pending'
        );
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading claims:', error);
      },
    });
  }

  //for only employee
  loadClaimsByEmployeeId(empId: number) {
    this.expenseClaimService.getAllClaimsByEmployeeId(empId).subscribe({
      next: (result: any) => {
        this.claimList = result.data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      },
    });
  }

  deleteExpenseClaim(claimId: number) {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.expenseClaimService.deleteClaim(claimId).subscribe({
        next: (response: APIResponseModel) => {
          if (response.status === 'success') {
            alert('Claim deleted successfully!');
            this.loadAllExpenseClaims();
          }
        },
        error: (error) => {
          alert('Failed to delete claim.');
          console.error(error);
        },
      });
    }
  }

  // editExpenseClaim(claimId: number) {
  //   if (confirm('Are you sure you want to update this claim?')) {
  //     this.expenseClaimService.updateClaim(claimId).subscribe({
  //       next: (response: APIResponseModel) => {
  //         if (response.status === 'success') {
  //           this.loadAllExpenseClaims();
  //         }
  //       },
  //       error: (error) => {
  //         alert('Failed to update claim.');
  //         console.error(error);
  //       },
  //     });
  //   }
  // }

  editExpenseClaim(claimId: number) {
    this.router.navigate(['/expense-claims/edit', claimId]);
  }

  approveClaim(id: number) {
    this.expenseClaimService.approveClaim(id).subscribe({
      next: () => {
        this.loadExpenseClaimsForApproval();
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }

  rejectClaim(id: number) {
    this.expenseClaimService.rejectClaim(id).subscribe({
      next: () => {
        this.loadExpenseClaimsForApproval();
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }
}
