import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCotizacionIndexComponent } from './generar-cotizacion-index.component';

describe('GenerarCotizacionIndexComponent', () => {
  let component: GenerarCotizacionIndexComponent;
  let fixture: ComponentFixture<GenerarCotizacionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCotizacionIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotizacionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
