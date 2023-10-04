import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosCargeMasivoFormComponent } from './empleados-carge-masivo-form.component';

describe('EmpleadosCargeMasivoFormComponent', () => {
  let component: EmpleadosCargeMasivoFormComponent;
  let fixture: ComponentFixture<EmpleadosCargeMasivoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadosCargeMasivoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosCargeMasivoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
