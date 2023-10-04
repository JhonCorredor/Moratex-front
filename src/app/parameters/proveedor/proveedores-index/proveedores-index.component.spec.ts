import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresIndexComponent } from './proveedores-index.component';

describe('ProveedoresIndexComponent', () => {
  let component: ProveedoresIndexComponent;
  let fixture: ComponentFixture<ProveedoresIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedoresIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedoresIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
