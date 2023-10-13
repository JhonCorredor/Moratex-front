import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientosFormComponent } from './seguimientos-form.component';

describe('SeguimientosFormComponent', () => {
  let component: SeguimientosFormComponent;
  let fixture: ComponentFixture<SeguimientosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
