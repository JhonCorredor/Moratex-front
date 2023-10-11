import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimientosFormComponent } from './procedimientos-form.component';

describe('ProcedimientosFormComponent', () => {
  let component: ProcedimientosFormComponent;
  let fixture: ComponentFixture<ProcedimientosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimientosFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimientosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
