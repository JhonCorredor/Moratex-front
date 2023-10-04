import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCompraDetalleFormComponent } from './factura-compra-detalle-form.component';

describe('PrendasPiezasFormComponent', () => {
  let component: FacturaCompraDetalleFormComponent;
  let fixture: ComponentFixture<FacturaCompraDetalleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaCompraDetalleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaCompraDetalleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
