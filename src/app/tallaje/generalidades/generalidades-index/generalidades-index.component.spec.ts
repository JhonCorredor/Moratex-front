import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralidadesIndexComponent } from './generalidades-index.component';

describe('GeneralidadesIndexComponent', () => {
  let component: GeneralidadesIndexComponent;
  let fixture: ComponentFixture<GeneralidadesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralidadesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralidadesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
