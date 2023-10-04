import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaInsumosComponent } from './ficha-tecnica-insumos.component';

describe('FichaTecnicaInsumosComponent', () => {
  let component: FichaTecnicaInsumosComponent;
  let fixture: ComponentFixture<FichaTecnicaInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTecnicaInsumosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
