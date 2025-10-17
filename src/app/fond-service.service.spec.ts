import { TestBed } from '@angular/core/testing';

import { FondServiceService } from './fond-service.service';

describe('FondServiceService', () => {
  let service: FondServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FondServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
