import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezasFormComponent } from './piezas-form.component';

describe('PiezasFormComponent', () => {
  let component: PiezasFormComponent;
  let fixture: ComponentFixture<PiezasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiezasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiezasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
