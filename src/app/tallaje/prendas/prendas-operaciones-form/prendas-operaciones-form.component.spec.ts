import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendasOperacionesFormComponent } from './prendas-operaciones-form.component';

describe('PrendasOperacionesFormComponent', () => {
  let component: PrendasOperacionesFormComponent;
  let fixture: ComponentFixture<PrendasOperacionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrendasOperacionesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendasOperacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
