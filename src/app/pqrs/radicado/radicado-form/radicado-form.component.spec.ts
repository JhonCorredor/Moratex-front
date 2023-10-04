import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicadosFormComponent } from './radicado-form.component';

describe('RadicadosFormComponent', () => {
  let component: RadicadosFormComponent;
  let fixture: ComponentFixture<RadicadosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadicadosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicadosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
