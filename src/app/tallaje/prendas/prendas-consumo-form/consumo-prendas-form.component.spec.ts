import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosPrendasFormComponent } from './consumo-prendas-form.component';

describe('ConsumosPrendasFormComponent', () => {
  let component: ConsumosPrendasFormComponent;
  let fixture: ComponentFixture<ConsumosPrendasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumosPrendasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosPrendasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
