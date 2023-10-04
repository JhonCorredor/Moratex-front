import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpFormComponent } from './op-form.component';

describe('OpFormComponent', () => {
  let component: OpFormComponent;
  let fixture: ComponentFixture<OpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
