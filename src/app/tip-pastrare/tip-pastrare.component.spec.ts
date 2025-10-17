import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipPastrareComponent } from './tip-pastrare.component';

describe('TipPastrareComponent', () => {
  let component: TipPastrareComponent;
  let fixture: ComponentFixture<TipPastrareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipPastrareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipPastrareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
