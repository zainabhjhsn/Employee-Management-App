import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  editingLeaveTypeId: number | null = null;
  editLeaveTypeName: string = '';

  constructor(
    private leaveTypeService: LeaveTypeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLeaveTypes();
  }

  loadLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe((types) => {
      this.leaveTypes = types;
      this.cd.detectChanges();
    });
  }

  addLeaveType() {
    if (!this.newLeaveTypeName.trim()) return;

    this.leaveTypeService
      .createLeaveType({ name: this.newLeaveTypeName.trim() })
      .subscribe(() => {
        this.newLeaveTypeName = '';
        this.loadLeaveTypes();
      });
  }

  deleteLeaveType(id: number) {
    this.leaveTypeService.deleteLeaveType(id).subscribe(() => {
      this.loadLeaveTypes();
    });
  }

  // editLeaveType(id: number) {
  //   this.leaveTypeService.editLeaveType(id).subscribe(() => {
  //     this.loadLeaveTypes();
  //   });
  // }

  startEdit(leaveType: LeaveType) {
    this.editingLeaveTypeId = leaveType.id;
    this.editLeaveTypeName = leaveType.name;
  }

  cancelEdit() {
    this.editingLeaveTypeId = null;
    this.editLeaveTypeName = '';
  }

  saveEdit(id: number) {
    if (!this.editLeaveTypeName.trim()) return;

    this.leaveTypeService
      .editLeaveType(id, { name: this.editLeaveTypeName.trim() })
      .subscribe(() => {
        this.editingLeaveTypeId = null;
        this.editLeaveTypeName = '';
        this.loadLeaveTypes();
      });
  }
}
