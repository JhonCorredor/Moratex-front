import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacorasInventariosIndexComponent } from './bitacora-inventario-index.component';

describe('BitacorasInventariosIndexComponent', () => {
  let component: BitacorasInventariosIndexComponent;
  let fixture: ComponentFixture<BitacorasInventariosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitacorasInventariosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitacorasInventariosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
