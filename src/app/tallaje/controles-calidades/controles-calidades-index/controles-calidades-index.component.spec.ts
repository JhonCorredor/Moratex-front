import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlesCalidadesIndexComponent } from './controles-calidades-index.component';

describe('ControlesCalidadesIndexComponent', () => {
  let component: ControlesCalidadesIndexComponent;
  let fixture: ComponentFixture<ControlesCalidadesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlesCalidadesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlesCalidadesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
