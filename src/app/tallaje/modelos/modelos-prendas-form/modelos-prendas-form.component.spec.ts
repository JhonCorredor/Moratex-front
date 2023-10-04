import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosPrendasFormComponent } from './modelos-prendas-form.component';

describe('ModelosPrendasFormComponent', () => {
  let component: ModelosPrendasFormComponent;
  let fixture: ComponentFixture<ModelosPrendasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelosPrendasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosPrendasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
