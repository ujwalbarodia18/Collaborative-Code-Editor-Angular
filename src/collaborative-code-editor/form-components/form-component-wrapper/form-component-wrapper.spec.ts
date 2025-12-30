import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentWrapper } from './form-component-wrapper';

describe('FormComponentWrapper', () => {
  let component: FormComponentWrapper;
  let fixture: ComponentFixture<FormComponentWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponentWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponentWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
