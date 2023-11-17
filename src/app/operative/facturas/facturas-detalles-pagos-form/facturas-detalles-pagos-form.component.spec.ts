import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasDetallesPagosFormComponent } from './facturas-detalles-pagos-form.component';

describe('FacturasDetallesPagosFormComponent', () => {
  let component: FacturasDetallesPagosFormComponent;
  let fixture: ComponentFixture<FacturasDetallesPagosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturasDetallesPagosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasDetallesPagosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
