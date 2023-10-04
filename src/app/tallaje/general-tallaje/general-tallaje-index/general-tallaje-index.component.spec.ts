import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTallajeIndexComponent } from './general-tallaje-index.component';

describe('GeneralTallajeIndexComponent', () => {
  let component: GeneralTallajeIndexComponent;
  let fixture: ComponentFixture<GeneralTallajeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTallajeIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTallajeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
