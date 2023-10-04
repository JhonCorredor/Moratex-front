import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosFormComponent } from './formularios-form.component';

describe('FormulariosFormComponent', () => {
  let component: FormulariosFormComponent;
  let fixture: ComponentFixture<FormulariosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulariosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulariosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
