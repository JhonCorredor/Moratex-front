import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDetallesIndexComponent } from './pedidos-detalles-index.component';

describe('PedidosDetallesIndexComponent', () => {
  let component: PedidosDetallesIndexComponent;
  let fixture: ComponentFixture<PedidosDetallesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosDetallesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDetallesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
