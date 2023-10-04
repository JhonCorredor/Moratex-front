import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmarConsolidadoComponent } from './armar-consolidado.component';

describe('ArmarConsolidadoComponent', () => {
  let component: ArmarConsolidadoComponent;
  let fixture: ComponentFixture<ArmarConsolidadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmarConsolidadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmarConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
