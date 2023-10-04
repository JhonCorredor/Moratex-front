import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaOperacionesComponent } from './ficha-tecnica-operaciones.component';

describe('FichaTecnicaOperacionesComponent', () => {
  let component: FichaTecnicaOperacionesComponent;
  let fixture: ComponentFixture<FichaTecnicaOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTecnicaOperacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
