import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoIndexComponent } from './consolidado-index.component';

describe('EmpleadosFormComponent', () => {
  let component: ConsolidadoIndexComponent;
  let fixture: ComponentFixture<ConsolidadoIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidadoIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
