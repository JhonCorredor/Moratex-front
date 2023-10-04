import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesIndexComponent } from './operaciones-index.component';

describe('OperacionesIndexComponent', () => {
  let component: OperacionesIndexComponent;
  let fixture: ComponentFixture<OperacionesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperacionesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
