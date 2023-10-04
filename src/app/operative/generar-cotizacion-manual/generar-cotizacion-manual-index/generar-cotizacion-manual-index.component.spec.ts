import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCotizacionManualIndexComponent } from './generar-cotizacion-manual-index.component';

describe('GenerarCotizacionManualIndexComponent', () => {
  let component: GenerarCotizacionManualIndexComponent;
  let fixture: ComponentFixture<GenerarCotizacionManualIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCotizacionManualIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotizacionManualIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
