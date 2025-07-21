import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveModal } from './leave-modal';

describe('LeaveModal', () => {
  let component: LeaveModal;
  let fixture: ComponentFixture<LeaveModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
