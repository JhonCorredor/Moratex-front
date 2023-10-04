import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesCompraIndexComponent } from './ordenes-compra-index.component';

describe('OrdenesCompraIndexComponent', () => {
  let component: OrdenesCompraIndexComponent;
  let fixture: ComponentFixture<OrdenesCompraIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesCompraIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesCompraIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
