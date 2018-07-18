import { TestBed, inject } from '@angular/core/testing';

import { Ipservice } from './ipservice.service';


describe('PaytamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ipservice]
    });
  });

  it('should be created', inject([Ipservice], (service: Ipservice) => {
    expect(service).toBeTruthy();
  }));
});
