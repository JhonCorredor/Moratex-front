import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezasIndexComponent } from './piezas-index.component';

describe('PiezasIndexComponent', () => {
  let component: PiezasIndexComponent;
  let fixture: ComponentFixture<PiezasIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiezasIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiezasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
