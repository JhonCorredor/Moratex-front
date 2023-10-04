import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosIndexComponent } from './inventarios-index.component';

describe('InventariosIndexComponent', () => {
  let component: InventariosIndexComponent;
  let fixture: ComponentFixture<InventariosIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
