import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesFormularioFormComponent } from './roles-formulario-formcomponent';

describe('RolesFormularioFormComponent', () => {
  let component: RolesFormularioFormComponent;
  let fixture: ComponentFixture<RolesFormularioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesFormularioFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesFormularioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
