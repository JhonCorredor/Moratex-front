import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesDetallesFormComponent } from './cotizaciones-detalles-form.component';

describe('CotizacionesDetallesFormComponent', () => {
  let component: CotizacionesDetallesFormComponent;
  let fixture: ComponentFixture<CotizacionesDetallesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesDetallesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesDetallesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
