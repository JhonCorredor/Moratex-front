import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesDetallesIndexComponent } from './cotizaciones-detalles-index.component';

describe('CotizacionesDetallesIndexComponent', () => {
  let component: CotizacionesDetallesIndexComponent;
  let fixture: ComponentFixture<CotizacionesDetallesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesDetallesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesDetallesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
