import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCompraFormComponent } from './factura-compra-form.component';

describe('FacturaCompraFormComponent', () => {
  let component: FacturaCompraFormComponent;
  let fixture: ComponentFixture<FacturaCompraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaCompraFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaCompraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
