import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasFormComponent } from './personas-form.component';

describe('PersonasFormComponent', () => {
  let component: PersonasFormComponent;
  let fixture: ComponentFixture<PersonasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
