import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTallajeFormComponent } from './general-tallaje-form.component';

describe('GeneralTallajeFormComponent', () => {
  let component: GeneralTallajeFormComponent;
  let fixture: ComponentFixture<GeneralTallajeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTallajeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTallajeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
