import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDetailFormComponent } from './op-detail-form.component';

describe('OpDetailFormComponent', () => {
  let component: OpDetailFormComponent;
  let fixture: ComponentFixture<OpDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
