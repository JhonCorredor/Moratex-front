import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDetailIndexComponent } from './op-detail-index.component';

describe('OpDetailIndexComponent', () => {
  let component: OpDetailIndexComponent;
  let fixture: ComponentFixture<OpDetailIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpDetailIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpDetailIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
