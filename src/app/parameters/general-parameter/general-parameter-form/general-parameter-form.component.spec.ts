import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralParameterFormComponent } from './general-parameter-form.component';

describe('GeneralParameterFormComponent', () => {
  let component: GeneralParameterFormComponent;
  let fixture: ComponentFixture<GeneralParameterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralParameterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
