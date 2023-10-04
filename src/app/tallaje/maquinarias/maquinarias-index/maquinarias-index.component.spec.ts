import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariasIndexComponent } from './maquinarias-index.component';

describe('MaquinariasIndexComponent', () => {
  let component: MaquinariasIndexComponent;
  let fixture: ComponentFixture<MaquinariasIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinariasIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinariasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
