import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaPiezasComponent } from './ficha-tecnica-piezas.component';

describe('FichaTecnicaPiezasComponent', () => {
  let component: FichaTecnicaPiezasComponent;
  let fixture: ComponentFixture<FichaTecnicaPiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTecnicaPiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaPiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
