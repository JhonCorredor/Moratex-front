import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesPedidosProductosFormComponent } from './ordenes-pedidos-productos-form.component';

describe('OrdenesPedidosProductosFormComponent', () => {
  let component: OrdenesPedidosProductosFormComponent;
  let fixture: ComponentFixture<OrdenesPedidosProductosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesPedidosProductosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesPedidosProductosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
