import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosFormComponent } from './inventarios-form.component';

describe('InventariosFormComponent', () => {
  let component: InventariosFormComponent;
  let fixture: ComponentFixture<InventariosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
