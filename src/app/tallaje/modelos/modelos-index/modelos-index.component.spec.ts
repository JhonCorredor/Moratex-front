import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosIndexComponent } from './modelos-index.component';

describe('ModelosIndexComponent', () => {
  let component: ModelosIndexComponent;
  let fixture: ComponentFixture<ModelosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
