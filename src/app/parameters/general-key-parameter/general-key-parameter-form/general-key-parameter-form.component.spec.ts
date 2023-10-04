import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralKeyParameterFormComponent } from './general-key-parameter-form.component';

describe('GeneralKeyParameterFormComponent', () => {
  let component: GeneralKeyParameterFormComponent;
  let fixture: ComponentFixture<GeneralKeyParameterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralKeyParameterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralKeyParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
