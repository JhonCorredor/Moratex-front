import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesCompraFormComponent } from './ordenes-compra-form.component';

describe('OrdenesCompraFormComponent', () => {
  let component: OrdenesCompraFormComponent;
  let fixture: ComponentFixture<OrdenesCompraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesCompraFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesCompraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
