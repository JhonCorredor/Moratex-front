import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasModelosCargosComponent } from './empresas-modelos-cargos.component';

describe('EmpresasModelosCargosComponent', () => {
  let component: EmpresasModelosCargosComponent;
  let fixture: ComponentFixture<EmpresasModelosCargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresasModelosCargosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasModelosCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
