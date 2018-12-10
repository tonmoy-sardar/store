import { TestBed, inject } from '@angular/core/testing';

import { SeoserviceService } from './seoservice.service';

describe('SeoserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoserviceService]
    });
  });

  it('should be created', inject([SeoserviceService], (service: SeoserviceService) => {
    expect(service).toBeTruthy();
  }));
});
