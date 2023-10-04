import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoPorveedoresFormComponent } from './producto-porveedores-form.component';

describe('ProductoPorveedoresFormComponent', () => {
  let component: ProductoPorveedoresFormComponent;
  let fixture: ComponentFixture<ProductoPorveedoresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoPorveedoresFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoPorveedoresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
