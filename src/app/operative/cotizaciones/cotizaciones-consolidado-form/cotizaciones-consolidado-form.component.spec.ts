import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesConsolidadoFormComponent } from './cotizaciones-consolidado-form.component';

describe('EmpleadosFormComponent', () => {
  let component: CotizacionesConsolidadoFormComponent;
  let fixture: ComponentFixture<CotizacionesConsolidadoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesConsolidadoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesConsolidadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
