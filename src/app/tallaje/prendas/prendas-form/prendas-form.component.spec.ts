import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendasFormComponent } from './prendas-form.component';

describe('PrendasFormComponent', () => {
  let component: PrendasFormComponent;
  let fixture: ComponentFixture<PrendasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrendasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
