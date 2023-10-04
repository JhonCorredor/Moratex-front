import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaInsumosTallasComponent } from './ficha-tecnica-insumos-tallas.component';

describe('FichaTecnicaInsumosTallasComponent', () => {
  let component: FichaTecnicaInsumosTallasComponent;
  let fixture: ComponentFixture<FichaTecnicaInsumosTallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTecnicaInsumosTallasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaInsumosTallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
