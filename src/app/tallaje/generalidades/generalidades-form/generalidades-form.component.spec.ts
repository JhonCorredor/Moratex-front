import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralidadesFormComponent } from './generalidades-form.component';

describe('GeneralidadesFormComponent', () => {
  let component: GeneralidadesFormComponent;
  let fixture: ComponentFixture<GeneralidadesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralidadesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralidadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
