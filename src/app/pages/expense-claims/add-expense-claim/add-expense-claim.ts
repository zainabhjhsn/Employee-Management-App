import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  totalCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private expenseClaimService: ExpenseClaimService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.addExpenseDetail(); // Add the first entry
    this.setupTotalCalculation();
  }

  initForm(): void {
    this.expenseClaimForm = this.fb.group({
      id: [null],
      employee_id: [this.authService.getUser()?.id || null, Validators.required],
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
  }

  removeExpenseDetail(index: number): void {
    if (this.expenseDetails.length > 1) {
      this.expenseDetails.removeAt(index);
      this.calculateTotal();
    }
  }

  setupTotalCalculation(): void {
    this.expenseDetails.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    const total = this.expenseDetails.controls.reduce((acc, group) => {
      const value = parseFloat(group.get('total')?.value) || 0;
      return acc + value;
    }, 0);
    this.totalCount = total;
    this.expenseClaimForm.get('total')?.setValue(total);
  }

  onSubmit(): void {
    if (this.expenseClaimForm.invalid) {
      this.expenseClaimForm.markAllAsTouched();
      return;
    }

    const payload = this.expenseClaimForm.value;

    this.expenseClaimService.onAddExpenseClaim(payload).subscribe({
      next: (response: APIResponseModel) => {
        if (response.status === 'success') {
          this.router.navigate(['/expense-claims']);
        }
      },
      error: (error) => {
        alert('Failed.');
        console.error(error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/expense-claims']);
  }
}
