import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariasFormComponent } from './maquinarias-form.component';

describe('MaquinariasFormComponent', () => {
  let component: MaquinariasFormComponent;
  let fixture: ComponentFixture<MaquinariasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinariasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinariasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
