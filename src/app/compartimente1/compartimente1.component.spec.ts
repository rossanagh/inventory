import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compartimente1Component } from './compartimente1.component';

describe('Compartimente1Component', () => {
  let component: Compartimente1Component;
  let fixture: ComponentFixture<Compartimente1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compartimente1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compartimente1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
