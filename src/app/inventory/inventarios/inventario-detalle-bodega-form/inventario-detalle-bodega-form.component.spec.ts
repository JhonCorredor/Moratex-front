import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioDetalleBodegaFormComponent } from './inventario-detalle-bodega-form.component';

describe('InventarioDetalleBodegaFormComponent', () => {
  let component: InventarioDetalleBodegaFormComponent;
  let fixture: ComponentFixture<InventarioDetalleBodegaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioDetalleBodegaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioDetalleBodegaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
