import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasIndexComponent } from './facturas-index.component';

describe('FacturasIndexComponent', () => {
  let component: FacturasIndexComponent;
  let fixture: ComponentFixture<FacturasIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturasIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
