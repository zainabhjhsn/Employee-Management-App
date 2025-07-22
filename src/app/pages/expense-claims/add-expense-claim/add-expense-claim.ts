import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseClaimService } from '../../../services/expense-claim';
import { APIResponseModel } from '../../../models/Employee.model';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-add-expense-claim',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense-claim.html',
  styleUrl: './add-expense-claim.css',
})
export class AddExpenseClaim implements OnInit {
  expenseClaimForm!: FormGroup;
  totalCount = 0;

  isEditMode: boolean = false;
  claimId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private expenseClaimService: ExpenseClaimService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.claimId = Number(this.route.snapshot.paramMap.get('id'));
    // this.isEditMode = !!this.claimId;
    if (this.claimId) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }

    this.initForm();

    if (this.isEditMode) {
      this.loadClaimData();
    } else {
      this.addExpenseDetail(); // Add at least one detail if creating new (first entry)
    }
  }

  formatDate = (isoString: string) => {
    return isoString?.split('T')[0]; // "2025-07-22T00:00:00.000Z" -> "2025-07-22"
  };

  private loadClaimData(): void {
    this.expenseClaimService.getClaimById(this.claimId).subscribe({
      next: (res: APIResponseModel) => {
        const data: ExpenseClaim = res.data;
        this.expenseClaimForm.patchValue({
          id: data.id,
          employee_id: data.employee_id,
          date: this.formatDate(data.date),
          total: data.total,
          description: data.description,
          status: data.status,
        });

        // Clear any existing entries
        this.expenseDetails.clear();

        if (data.details && data.details.length > 0) {
          data.details.forEach((entry: any) => {
            const detailGroup = this.fb.group({
              date: [this.formatDate(entry.date)],
              type: [entry.type],
              description: [entry.description],
              total: [entry.total],
            });

            detailGroup.get('total')?.valueChanges.subscribe(() => {
              this.calculateTotal();
            });

            this.expenseDetails.push(detailGroup);
          });
        }

        this.calculateTotal();
      },
      error: (err) => {
        console.error('Failed to load claim data:', err);
        this.router.navigate(['/expense-claims']);
      },
    });
  }

  private initForm(): void {
    this.expenseClaimForm = this.fb.group({
      id: [null],
      employee_id: [
        this.authService.getUser()?.id || null,
        Validators.required,
      ],
      date: [''],
      total: [0],
      description: [''],
      status: ['pending'],
      expenseDetails: this.fb.array([]),
    });
  }

  get expenseDetails(): FormArray {
    return this.expenseClaimForm.get('expenseDetails') as FormArray;
  }

  addExpenseDetail(): void {
    const detailGroup = this.fb.group({
      date: [''],
      type: ['hotel'],
      description: [''],
      total: [0],
    });

    this.expenseDetails.push(detailGroup);

    detailGroup.get('total')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  removeExpenseDetail(index: number): void {
    if (this.expenseDetails.length > 1) {
      this.expenseDetails.removeAt(index);
      this.calculateTotal();
    }
  }

  private calculateTotal(): void {
    const total = this.expenseDetails.controls.reduce((sum, group) => {
      return sum + (parseFloat(group.get('total')?.value) || 0);
    }, 0);

    this.totalCount = total;
    this.expenseClaimForm.get('total')?.setValue(total, { emitEvent: false });
  }

  // onSubmit(): void {
  //   if (this.expenseClaimForm.invalid) {
  //     this.expenseClaimForm.markAllAsTouched();
  //     return;
  //   }

  //   const payload = this.expenseClaimForm.value;

  //   this.expenseClaimService.onAddExpenseClaim(payload).subscribe({
  //     next: (response: APIResponseModel) => {
  //       if (response.status === 'success') {
  //         this.router.navigate(['/expense-claims']);
  //       }
  //     },
  //     error: (error) => {
  //       alert('Failed.');
  //       console.error(error);
  //     },
  //   });
  // }
  onSubmit(): void {
    if (this.expenseClaimForm.invalid) {
      this.expenseClaimForm.markAllAsTouched();
      return;
    }

    const payload = this.expenseClaimForm.value;

    if (this.isEditMode && this.claimId) {
      this.expenseClaimService.updateClaim(payload).subscribe({
        next: (response: APIResponseModel) => {
          if (response.status === 'success') {
            this.router.navigate(['/expense-claims']);
          }
        },
        error: (error) => {
          alert('Failed to update.');
          console.error(error);
        },
      });
    } else {
      this.expenseClaimService.onAddExpenseClaim(payload).subscribe({
        next: (response: APIResponseModel) => {
          if (response.status === 'success') {
            this.router.navigate(['/expense-claims']);
          }
        },
        error: (error) => {
          alert('Failed to add.');
          console.error(error);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/expense-claims']);
  }
}
