import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosFormComponent } from './modulos-form.component';

describe('ModulosFormComponent', () => {
  let component: ModulosFormComponent;
  let fixture: ComponentFixture<ModulosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
