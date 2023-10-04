import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosPrendasTallasFormComponent } from './prendas-consumos-tallas-form.component';

describe('ConsumosPrendasTallasFormComponent', () => {
  let component: ConsumosPrendasTallasFormComponent;
  let fixture: ComponentFixture<ConsumosPrendasTallasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumosPrendasTallasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosPrendasTallasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
