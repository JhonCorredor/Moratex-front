import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCompraIndexComponent } from './factura-compra.component';

describe('PrendasIndexComponent', () => {
  let component: FacturaCompraIndexComponent;
  let fixture: ComponentFixture<FacturaCompraIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaCompraIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaCompraIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
