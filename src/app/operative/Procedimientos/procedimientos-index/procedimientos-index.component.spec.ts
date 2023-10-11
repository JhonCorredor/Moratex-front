import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimientosIndexComponent } from './procedimientos-index.component';

describe('ProcedimientosIndexComponent', () => {
  let component: ProcedimientosIndexComponent;
  let fixture: ComponentFixture<ProcedimientosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedimientosIndexComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimientosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
