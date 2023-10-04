import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpQualityFormComponent } from './op-quality-form.component';

describe('OpQualityFormComponent', () => {
  let component: OpQualityFormComponent;
  let fixture: ComponentFixture<OpQualityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpQualityFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpQualityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
