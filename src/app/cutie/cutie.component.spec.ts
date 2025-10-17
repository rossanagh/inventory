import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutieComponent } from './cutie.component';

describe('CutieComponent', () => {
  let component: CutieComponent;
  let fixture: ComponentFixture<CutieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CutieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CutieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
