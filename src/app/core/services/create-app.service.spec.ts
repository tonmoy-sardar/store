import { TestBed, inject } from '@angular/core/testing';

import { CreateAppService } from './create-app.service';

describe('CreateAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateAppService]
    });
  });

  it('should be created', inject([CreateAppService], (service: CreateAppService) => {
    expect(service).toBeTruthy();
  }));
});
