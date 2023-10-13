import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosIndexComponent } from './costos-index.component';

describe('CostosIndexComponent', () => {
  let component: CostosIndexComponent;
  let fixture: ComponentFixture<CostosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostosIndexComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
