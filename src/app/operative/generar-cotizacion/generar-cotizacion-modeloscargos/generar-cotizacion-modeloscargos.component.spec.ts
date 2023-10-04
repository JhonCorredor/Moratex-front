import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCotizacionModeloscargosComponent } from './generar-cotizacion-modeloscargos.component';

describe('GenerarCotizacionModeloscargosComponent', () => {
  let component: GenerarCotizacionModeloscargosComponent;
  let fixture: ComponentFixture<GenerarCotizacionModeloscargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCotizacionModeloscargosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotizacionModeloscargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
