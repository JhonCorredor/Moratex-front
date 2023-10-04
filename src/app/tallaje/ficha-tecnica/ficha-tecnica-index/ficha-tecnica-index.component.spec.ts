import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaIndexComponent } from './ficha-tecnica-index.component';

describe('FichaTecnicaIndexComponent', () => {
  let component: FichaTecnicaIndexComponent;
  let fixture: ComponentFixture<FichaTecnicaIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTecnicaIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
