import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesFormComponent } from './cotizaciones-form.component';

describe('CotizacionesFormComponent', () => {
  let component: CotizacionesFormComponent;
  let fixture: ComponentFixture<CotizacionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
