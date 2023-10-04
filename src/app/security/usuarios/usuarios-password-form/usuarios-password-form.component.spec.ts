import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosPasswordFormComponent } from './usuarios-password-form.component';

describe('UsuariosPasswordFormComponent', () => {
  let component: UsuariosPasswordFormComponent;
  let fixture: ComponentFixture<UsuariosPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosPasswordFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
