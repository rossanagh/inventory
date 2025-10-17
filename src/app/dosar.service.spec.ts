import { TestBed } from '@angular/core/testing';

import { DosarService } from './dosar.service';

describe('DosarService', () => {
  let service: DosarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
