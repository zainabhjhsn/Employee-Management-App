import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseClaim } from './add-expense-claim';

describe('AddExpenseClaim', () => {
  let component: AddExpenseClaim;
  let fixture: ComponentFixture<AddExpenseClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseClaim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpenseClaim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
