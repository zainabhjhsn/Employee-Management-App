import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { APIResponseModel } from '../../../models/Employee.model';
import { LeaveService } from '../../../services/leave';
import { EmployeeService } from '../../../services/employee';
import { LeaveTypeService } from '../../../services/leave-type';
import { LeaveType } from '../../../models/LeaveType.model';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-leave-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './leave-modal.html',
  styleUrl: './leave-modal.css',
})
export class LeaveModal implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() leaveToEdit: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() leaveSubmitted = new EventEmitter<void>();

  leaveForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    employee_id: new FormControl(null), // Set to null, not 0
    leave_type_id: new FormControl(null),
    from_date: new FormControl(''),
    to_date: new FormControl(''),
    number_of_days: new FormControl(0),
    note: new FormControl(''),
    status: new FormControl('pending'),
  });

  leaveList: any[] = [];
  employees: any[] = [];
  leaveTypes: any[] = [];

  statusOptions = ['pending', 'approved', 'rejected'];

  leaveService = inject(LeaveService);
  employeeService = inject(EmployeeService);
  leaveTypeService = inject(LeaveTypeService);
  authService = inject(AuthService);

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['leaveToEdit'] && changes['leaveToEdit'].currentValue) {
  //     this.leaveForm.patchValue(this.leaveToEdit);
  //   } else if (changes['leaveToEdit'] && !changes['leaveToEdit'].currentValue) {
  //     this.leaveForm.reset();
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leaveToEdit'] && changes['leaveToEdit'].currentValue) {
      const editedLeave = { ...this.leaveToEdit };

      // Format the dates to yyyy-MM-dd
      if (editedLeave.from_date) {
        editedLeave.from_date = this.formatDateToInput(editedLeave.from_date);
      }
      if (editedLeave.to_date) {
        editedLeave.to_date = this.formatDateToInput(editedLeave.to_date);
      }

      this.leaveForm.patchValue(editedLeave);
    } else if (changes['leaveToEdit'] && !changes['leaveToEdit'].currentValue) {
      this.leaveForm.reset();
    }
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadLeaveTypes();

    const user = this.authService.getUser();
    const employeeId = user.employee_id;

    // Always set the employee_id if available
    if (employeeId) {
      this.leaveForm.get('employee_id')?.setValue(employeeId);
    }

    // Adjust validation based on user role
    const employeeIdControl = this.leaveForm.get('employee_id');

    if (user.role === 'admin') {
      employeeIdControl?.setValidators(Validators.required);
    } else {
      // Employee role: don't require selecting employee_id
      employeeIdControl?.clearValidators();
    }

    employeeIdControl?.updateValueAndValidity();

    // 🛠️ Patch form if editing
    if (this.leaveToEdit) {
      this.leaveForm.patchValue(this.leaveToEdit);
    }
  }
  formatDateToInput(dateString: string): string {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatDate(date: string | Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (response: APIResponseModel) => {
        if (response.status === 'success') {
          this.employees = response.data;
        } else {
          this.employees = [];
        }
      },
      error: () => {
        this.employees = [];
      },
    });
  }

  loadLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe({
      next: (response: LeaveType[]) => {
        this.leaveTypes = response;
      },
      error: () => {
        this.leaveTypes = [];
      },
    });
  }

  onSubmitLeaveRequest() {
    if (this.leaveForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }
    const formValue = this.leaveForm.value;

    // this.leaveService.onAddLeave(formValue).subscribe({
    //   next: (response: any) => {
    //     if (response) {
    //       alert('Leave request submitted successfully!');
    //       this.leaveForm.reset();
    //       this.leaveSubmitted.emit(); // 🔁 tell parent to reload leaves
    //       this.closeModal();
    //     }
    //   },
    //   error: () => {
    //     alert('Failed');
    //   },
    // });

    const request$ = formValue.id
      ? this.leaveService.updateLeave(formValue)
      : this.leaveService.onAddLeave(formValue);

    request$.subscribe({
      next: () => {
        alert(
          formValue.id
            ? 'Leave updated successfully!'
            : 'Leave request submitted successfully!'
        );
        this.leaveForm.reset();
        this.leaveSubmitted.emit();
        this.closeModal();
      },
      error: () => {
        alert('Failed to process leave request.');
      },
    });
  }

  closeModal() {
    this.leaveForm.reset();
    this.close.emit(); //sends signal to parent
  }
}
