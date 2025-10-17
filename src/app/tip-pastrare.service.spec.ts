import { TestBed } from '@angular/core/testing';

import { TipPastrareService } from './tip-pastrare.service';

describe('TipPastrareService', () => {
  let service: TipPastrareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipPastrareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
