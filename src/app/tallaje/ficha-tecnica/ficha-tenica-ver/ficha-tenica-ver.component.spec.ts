import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTenicaVerComponent } from './ficha-tenica-ver.component';

describe('FichaTenicaVerComponent', () => {
  let component: FichaTenicaVerComponent;
  let fixture: ComponentFixture<FichaTenicaVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTenicaVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTenicaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
