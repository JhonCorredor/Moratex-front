import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosIndexComponent } from './modulos-index.component';

describe('ModulosIndexComponent', () => {
  let component: ModulosIndexComponent;
  let fixture: ComponentFixture<ModulosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
