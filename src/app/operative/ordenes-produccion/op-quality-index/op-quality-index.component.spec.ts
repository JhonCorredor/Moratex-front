import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpQualityIndexComponent } from './op-quality-index.component';

describe('OpQualityIndexComponent', () => {
  let component: OpQualityIndexComponent;
  let fixture: ComponentFixture<OpQualityIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpQualityIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpQualityIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
