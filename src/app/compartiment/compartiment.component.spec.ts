import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartimentComponent } from './compartiment.component';

describe('CompartimentComponent', () => {
  let component: CompartimentComponent;
  let fixture: ComponentFixture<CompartimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompartimentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompartimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
