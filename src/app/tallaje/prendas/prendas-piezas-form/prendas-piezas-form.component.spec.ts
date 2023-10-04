import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendasPiezasFormComponent } from './prendas-piezas-form.component';

describe('PrendasPiezasFormComponent', () => {
  let component: PrendasPiezasFormComponent;
  let fixture: ComponentFixture<PrendasPiezasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrendasPiezasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendasPiezasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
