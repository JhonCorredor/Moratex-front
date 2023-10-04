import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosCriteriosFormComponent } from './modelos-criterios-form.component';

describe('ModelosCriteriosFormComponent', () => {
  let component: ModelosCriteriosFormComponent;
  let fixture: ComponentFixture<ModelosCriteriosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelosCriteriosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosCriteriosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
