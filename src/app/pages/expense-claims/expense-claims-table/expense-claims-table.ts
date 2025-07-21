import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expense-claims-table',
  imports: [NgClass, CommonModule, RouterLink],
  templateUrl: './expense-claims-table.html',
  styleUrl: './expense-claims-table.css',
})
export class ExpenseClaimsTable {
  @Input() claimsList: any[] = [];
  @Input() showActions: boolean = false;
  @Input() isApprovalTable: boolean = false;

  @Output() approve = new EventEmitter<number>();
  @Output() reject = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();

  onApprove(id: number) {
    this.approve.emit(id);
  }

  onReject(id: number) {
    this.reject.emit(id);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onEdit(id: number) {
    this.edit.emit(id);
  }
}
