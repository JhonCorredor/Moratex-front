import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlesCalidadesFormComponent } from './controles-calidades-form.component';

describe('ControlesCalidadesFormComponent', () => {
  let component: ControlesCalidadesFormComponent;
  let fixture: ComponentFixture<ControlesCalidadesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlesCalidadesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlesCalidadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
