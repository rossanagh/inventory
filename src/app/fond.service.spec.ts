import { TestBed } from '@angular/core/testing';

import { FondService } from './fond.service';

describe('FondService', () => {
  let service: FondService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FondService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
