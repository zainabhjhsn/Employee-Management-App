import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExpenseClaimService } from '../../../services/expense-claim';
import { APIResponseModel } from '../../../models/Employee.model';

@Component({
  selector: 'app-add-expense-claim',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense-claim.html',
  styleUrl: './add-expense-claim.css',
})
export class AddExpenseClaim {
  expenseClaimForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    employee_id: new FormControl(null),
    date: new FormControl(''),
    total: new FormControl(0),
    description: new FormControl(''),
    status: new FormControl('pending'),
    expenseDetails: new FormArray([]),
  });

  totalCount: number = 0;

  constructor(
    private router: Router,
    private expenseClaimService: ExpenseClaimService
  ) {
    this.addExpenseDetail(); // add default one entry
  }

  get expenseDetails(): FormArray {
    return this.expenseClaimForm.get('expenseDetails') as FormArray;
  }
  

  addExpenseDetail() {
    const detailGroup = new FormGroup({
      date: new FormControl(''),
      type: new FormControl('hotel'),
      description: new FormControl(''),
      total: new FormControl(0),
    });
    detailGroup.get('total')?.valueChanges.subscribe(() => {
      this.updateTotalCount();
    });

    this.expenseDetails.push(detailGroup);
    this.updateTotalCount(); // refresh total when new entry added
  }

  updateTotalCount() {
    let total = 0;
    this.expenseDetails.controls.forEach((group: AbstractControl) => {
      const value = group.get('total')?.value;
      total += value ? parseFloat(value) : 0;
    });
    this.totalCount = total;
    this.expenseClaimForm.get('total')?.setValue(total);
  }

  removeExpenseDetail(index: number) {
    this.expenseDetails.removeAt(index);
    this.updateTotalCount(); // refresh total when removed
  }

  goBack() {
    this.router.navigate(['/expense-claims']);
  }

  onSubmit() {
    if (this.expenseClaimForm.invalid) {
      this.expenseClaimForm.markAllAsTouched();
      return;
    }

    const payload = this.expenseClaimForm.value;
    console.log('Form Submitted:', payload);

    // this.apiService.submitExpenseClaim(payload).subscribe(...)
    this.expenseClaimService.onAddExpenseClaim(payload).subscribe({
      next: (response: APIResponseModel) => {
        if (response.status === 'success') {
          // this.getEmployees();
          // this.employeeData = new EmployeeModel();
        }
      },
      error: (error) => {
        alert('Failed.');
        console.error(error);
      },
    });
    // After submit
    this.router.navigate(['/expense-claims']);
  }
}
