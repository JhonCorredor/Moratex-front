import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesIndexComponent } from './roles-index.component';

describe('RolesIndexComponent', () => {
  let component: RolesIndexComponent;
  let fixture: ComponentFixture<RolesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
