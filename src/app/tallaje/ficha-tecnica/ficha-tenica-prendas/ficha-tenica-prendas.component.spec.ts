import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTenicaPrendasComponent } from './ficha-tenica-prendas.component';

describe('FichaTenicaPrendasComponent', () => {
  let component: FichaTenicaPrendasComponent;
  let fixture: ComponentFixture<FichaTenicaPrendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTenicaPrendasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTenicaPrendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
