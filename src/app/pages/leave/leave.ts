import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { LeaveModal } from './leave-modal/leave-modal';
import { APIResponseModel } from '../../models/Employee.model';
import { AuthService } from '../../services/auth';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-leave',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CommonModule,
    LeaveModal,
    NgClass,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './leave.html',
  styleUrl: './leave.css',
})
export class Leave implements OnInit {
  @ViewChild('newModal') newModal!: ElementRef;

  leaveList: any[] = [];
  approvalLeaveList: any[] = [];

  showModal: boolean = false;

  currentTabName: string = 'leaves';

  userRole: string = '';
  employeeId: number = 0;

  selectedLeave: any = null;

  filterFromDate: string = '';
  filterToDate: string = '';

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private cd: ChangeDetectorRef // private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.role;
      this.employeeId = user.employee_id;

      if (this.isAdmin) {
        this.loadLeaves();
        this.loadLeavesForApproval();
      } else {
        this.loadLeavesByEmployeeId(this.employeeId);
      }
      this.cd.detectChanges();
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // loadLeaves() {
  //   this.leaveService.getAllLeaves().subscribe({
  //     next: (result: any) => {
  //       this.leaveList = result.data;
  //     },
  //     error: (error) => {
  //       console.error('Error loading leaves:', error);
  //     },
  //   });
  // }

  //with filtering
  loadLeaves() {
    this.leaveService
      .getAllLeaves(this.filterFromDate, this.filterToDate)
      .subscribe({
        next: (result: any) => {
          this.leaveList = result.data;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error loading leaves:', error);
        },
      });
  }

  loadLeavesByEmployeeId(empId: number) {
    console.log('Employee ID used in request:', empId);

    this.leaveService.getAllLeavesByEmployeeId(empId).subscribe({
      next: (result: any) => {
        this.leaveList = result.data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      },
    });
  }

  openModal(leave: any = null) {
    this.selectedLeave = leave;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  handleLeaveSubmitted() {
    this.loadLeaves(); // refresh the list
  }

  changeTab(tabName: string) {
    this.currentTabName = tabName;
  }

  loadLeavesForApproval() {
    this.leaveService.getAllLeaves().subscribe({
      next: (result: any) => {
        this.approvalLeaveList = result.data.filter(
          (m: any) => m.status == 'pending'
        );
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      },
    });
  }

  approveLeave(id: number) {
    this.leaveService.approveLeave(id).subscribe({
      next: () => {
        this.loadLeavesForApproval();
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }

  rejectLeave(id: number) {
    this.leaveService.rejectLeave(id).subscribe({
      next: () => {
        this.loadLeavesForApproval();
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }

  deleteLeave(leaveId: number) {
    if (confirm('Are you sure you want to delete this leave?')) {
      this.leaveService.deleteLeave(leaveId).subscribe({
        next: (response: APIResponseModel) => {
          if (response.status === 'success') {
            alert('Leave deleted successfully!');
            this.loadLeaves();
          }
        },
        error: (error) => {
          alert('Failed to delete leave.');
          console.error(error);
        },
      });
    }
  }

  // navigateToLeaves(employeeId: number) {
  //   this.router.navigate(['/leave', 'employee', employeeId]);
  // }

  applyDateFilter() {
    this.loadLeaves();
  }

  clearDateFilter() {
    this.filterFromDate = '';
    this.filterToDate = '';
    this.loadLeaves();
  }
}
