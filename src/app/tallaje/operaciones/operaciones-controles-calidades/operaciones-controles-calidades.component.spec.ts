import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesControlesCalidadesComponent } from './operaciones-controles-calidades.component';

describe('OperacionesControlesCalidadesComponent', () => {
  let component: OperacionesControlesCalidadesComponent;
  let fixture: ComponentFixture<OperacionesControlesCalidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperacionesControlesCalidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionesControlesCalidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
