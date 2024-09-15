import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomBootstrapDatePickerComponent} from './custom-bootstrap-date-picker.component';

describe('CustomBootstrapDatePickerComponent', () => {
  let component: CustomBootstrapDatePickerComponent;
  let fixture: ComponentFixture<CustomBootstrapDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomBootstrapDatePickerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomBootstrapDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
