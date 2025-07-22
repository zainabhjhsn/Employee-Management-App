import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EmployeeService } from '../../services/employee';
import {
  APIResponseModel,
  EmployeeList,
  EmployeeModel,
} from '../../models/Employee.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department';
import { Department } from '../../models/Department.model';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {
  employeeService = inject(EmployeeService);
  departmentService = inject(DepartmentService);

  employeeList: EmployeeList[] = [];

  @ViewChild('employeeModal') employeeModal!: ElementRef;

  employeeData: EmployeeModel = new EmployeeModel();

  departmentList$: Observable<Department[]> = new Observable<Department[]>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getEmployees();
    this.departmentList$ = this.departmentService.getDepartments();
  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (response: APIResponseModel) => {
        if (response.status === 'success') {
          this.employeeList = [];
          setTimeout(() => {
            this.employeeList = response.data;
            this.cd.detectChanges();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      },
    });
  }

  trackById(index: number, item: EmployeeList): number {
    return item.id;
  }

  openModal() {
    if (this.employeeModal) {
      //nativeElement gives us access to the underlying DOM element
      this.employeeModal.nativeElement.style.display = 'block';
    }
  }

  closeModal() {
    if (this.employeeModal) {
      this.employeeModal.nativeElement.style.display = 'none';
    }
    this.employeeData = new EmployeeModel(); // 🧹 Reset form data on close
  }

  submitAddEmployee() {
    this.employeeService.saveEmployee(this.employeeData).subscribe({
      next: (response: APIResponseModel) => {
        if (response.status === 'success') {
          alert('Employee added successfully!');
          this.getEmployees(); // Refresh list
          this.employeeData = new EmployeeModel(); // Reset form data
          this.closeModal(); // Close modal
        }
      },
      error: (error) => {
        alert('Failed to add employee.');
        console.error(error);
      },
    });
  }

  editEmployee(employee: EmployeeList) {
    this.employeeData = { ...employee }; // Create a copy of the employee data
    this.openModal(); // Reuse the add modal for editing
  }

  submitEditEmployee() {
    this.employeeService.saveEmployee(this.employeeData).subscribe({
      next: (response: APIResponseModel) => {
        if (response.status === 'success') {
          alert('Employee updated successfully!');
          this.getEmployees();
          this.employeeData = new EmployeeModel();
          this.closeModal();
        }
      },
      error: (error) => {
        alert('Failed to update employee.');
        console.error(error);
      },
    });
  }

  deleteEmployee(employeeId: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: (response: APIResponseModel) => {
          if (response.status === 'success') {
            alert('Employee deleted successfully!');
            this.getEmployees(); // Refresh list
          }
        },
        error: (error) => {
          alert('Failed to delete employee.');
          console.error(error);
        },
      });
    }
  }
}
