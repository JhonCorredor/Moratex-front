import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasIndexComponent } from './empresas-index.component';

describe('EmpresasIndexComponent', () => {
  let component: EmpresasIndexComponent;
  let fixture: ComponentFixture<EmpresasIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresasIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
