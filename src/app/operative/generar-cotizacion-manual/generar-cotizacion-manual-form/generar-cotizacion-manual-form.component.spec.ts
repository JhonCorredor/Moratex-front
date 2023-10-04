import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCotizacionManualFormComponent } from './generar-cotizacion-manual-form.component';

describe('GenerarCotizacionManualFormComponent', () => {
  let component: GenerarCotizacionManualFormComponent;
  let fixture: ComponentFixture<GenerarCotizacionManualFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCotizacionManualFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotizacionManualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
