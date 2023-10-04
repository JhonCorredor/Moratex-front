import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCotizacionEmpleadosComponent } from './generar-cotizacion-empleados.component';

describe('GenerarCotizacionEmpleadosComponent', () => {
  let component: GenerarCotizacionEmpleadosComponent;
  let fixture: ComponentFixture<GenerarCotizacionEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCotizacionEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotizacionEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
