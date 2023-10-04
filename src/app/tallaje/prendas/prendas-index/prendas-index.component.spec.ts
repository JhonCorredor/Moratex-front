import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendasIndexComponent } from './prendas-index.component';

describe('PrendasIndexComponent', () => {
  let component: PrendasIndexComponent;
  let fixture: ComponentFixture<PrendasIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrendasIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
