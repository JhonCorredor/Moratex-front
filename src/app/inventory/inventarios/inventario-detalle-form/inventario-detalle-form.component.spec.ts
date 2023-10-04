import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioDetalleFormComponent } from './inventario-detalle-formcomponent';

describe('InventarioDetalleFormComponent', () => {
  let component: InventarioDetalleFormComponent;
  let fixture: ComponentFixture<InventarioDetalleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioDetalleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioDetalleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
