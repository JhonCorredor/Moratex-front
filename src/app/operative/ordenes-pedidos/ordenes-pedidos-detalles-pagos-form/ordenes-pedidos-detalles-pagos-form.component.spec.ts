import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesPedidosDetallesPagosFormComponent } from './ordenes-pedidos-detalles-pagos-form.component';

describe('OrdenesPedidosDetallesPagosFormComponent', () => {
  let component: OrdenesPedidosDetallesPagosFormComponent;
  let fixture: ComponentFixture<OrdenesPedidosDetallesPagosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesPedidosDetallesPagosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesPedidosDetallesPagosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
