import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecotizacionComponent } from './precotizacion.component';

describe('PrecotizacionComponent', () => {
  let component: PrecotizacionComponent;
  let fixture: ComponentFixture<PrecotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
