import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDetallesFormComponent } from './pedidos-detalles-form.component';

describe('PedidosDetallesFormComponent', () => {
  let component: PedidosDetallesFormComponent;
  let fixture: ComponentFixture<PedidosDetallesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosDetallesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDetallesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
