import { TestBed, inject } from '@angular/core/testing';

import { FranchiseUserService } from './franchise-user.service';

describe('FranchiseUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FranchiseUserService]
    });
  });

  it('should be created', inject([FranchiseUserService], (service: FranchiseUserService) => {
    expect(service).toBeTruthy();
  }));
});
