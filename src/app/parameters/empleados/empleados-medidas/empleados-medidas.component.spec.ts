import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosMedidasComponent } from './empleados-medidas.component';

describe('EmpleadosMedidasComponent', () => {
  let component: EmpleadosMedidasComponent;
  let fixture: ComponentFixture<EmpleadosMedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadosMedidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
