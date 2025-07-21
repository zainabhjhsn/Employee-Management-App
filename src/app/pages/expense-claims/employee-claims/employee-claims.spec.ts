import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeClaims } from './employee-claims';

describe('EmployeeClaims', () => {
  let component: EmployeeClaims;
  let fixture: ComponentFixture<EmployeeClaims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeClaims]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeClaims);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
