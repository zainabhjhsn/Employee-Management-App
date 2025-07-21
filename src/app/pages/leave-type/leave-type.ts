import { Component, OnInit } from '@angular/core';
import { LeaveTypeService } from '../../services/leave-type';
import { LeaveType } from '../../models/LeaveType.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-type',
  imports: [FormsModule, CommonModule],
  templateUrl: './leave-type.html',
  styleUrl: './leave-type.css',
})
export class LeaveTypeComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  newLeaveTypeName: string = '';

  constructor(private leaveTypeService: LeaveTypeService) {}

  ngOnInit() {
    this.loadLeaveTypes();
  }

  loadLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe((types) => {
      this.leaveTypes = types;
    });
  }

  addLeaveType() {
    if (!this.newLeaveTypeName.trim()) return;
    
    this.leaveTypeService
      .createLeaveType({ name: this.newLeaveTypeName.trim() })
      .subscribe(() => {
        this.newLeaveTypeName = '';
        this.loadLeaveTypes(); // refresh list
      });
  }

  deleteLeaveType(id: number) {
    this.leaveTypeService.deleteLeaveType(id).subscribe(() => {
      this.loadLeaveTypes();
    });
  }
}
