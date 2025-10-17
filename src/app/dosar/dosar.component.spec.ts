import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosarComponent } from './dosar.component';

describe('DosarComponent', () => {
  let component: DosarComponent;
  let fixture: ComponentFixture<DosarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DosarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
