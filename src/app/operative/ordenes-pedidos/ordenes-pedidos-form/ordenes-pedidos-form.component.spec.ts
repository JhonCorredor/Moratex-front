import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesPedidosFormComponent } from './ordenes-pedidos-form.component';

describe('OrdenesPedidosFormComponent', () => {
  let component: OrdenesPedidosFormComponent;
  let fixture: ComponentFixture<OrdenesPedidosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesPedidosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesPedidosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
