import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesPedidosIndexComponent } from './ordenes-pedidos-index.component';

describe('OrdenesPedidosIndexComponent', () => {
  let component: OrdenesPedidosIndexComponent;
  let fixture: ComponentFixture<OrdenesPedidosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesPedidosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesPedidosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
