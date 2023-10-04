import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosIndexComponent } from './formularios-index.component';

describe('FormulariosIndexComponent', () => {
  let component: FormulariosIndexComponent;
  let fixture: ComponentFixture<FormulariosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulariosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulariosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
