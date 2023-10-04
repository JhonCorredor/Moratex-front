import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasIndexComponent } from './personas-index.component';

describe('PersonasIndexComponent', () => {
  let component: PersonasIndexComponent;
  let fixture: ComponentFixture<PersonasIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonasIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
