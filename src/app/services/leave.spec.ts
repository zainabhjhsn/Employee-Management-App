import { TestBed } from '@angular/core/testing';

import { LeaveService } from './leave';

describe('LeaveService', () => {
  let service: LeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
