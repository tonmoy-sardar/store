import { TestBed, inject } from '@angular/core/testing';

import { PaytamService } from './paytam.service';

describe('PaytamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaytamService]
    });
  });

  it('should be created', inject([PaytamService], (service: PaytamService) => {
    expect(service).toBeTruthy();
  }));
});
