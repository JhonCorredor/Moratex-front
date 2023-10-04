import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesIndexComponent } from './cotizaciones-index.component';

describe('CotizacionesIndexComponent', () => {
  let component: CotizacionesIndexComponent;
  let fixture: ComponentFixture<CotizacionesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
