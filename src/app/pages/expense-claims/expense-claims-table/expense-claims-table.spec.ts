import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseClaimsTable } from './expense-claims-table';

describe('ExpenseClaimsTable', () => {
  let component: ExpenseClaimsTable;
  let fixture: ComponentFixture<ExpenseClaimsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseClaimsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseClaimsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
