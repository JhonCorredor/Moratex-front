import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasComprasDetallesPagosFormComponent } from './facturas-compras-detalles-pagos-form.component';

describe('FacturasComprasDetallesPagosFormComponent', () => {
  let component: FacturasComprasDetallesPagosFormComponent;
  let fixture: ComponentFixture<FacturasComprasDetallesPagosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturasComprasDetallesPagosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasComprasDetallesPagosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
