import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicadosIndexComponent } from './radicado-index.component';

describe('RadicadosIndexComponent', () => {
  let component: RadicadosIndexComponent;
  let fixture: ComponentFixture<RadicadosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadicadosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicadosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
