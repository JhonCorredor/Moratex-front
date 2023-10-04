import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralParameterIndexComponent } from './general-parameter-index.component';

describe('GeneralParameterIndexComponent', () => {
  let component: GeneralParameterIndexComponent;
  let fixture: ComponentFixture<GeneralParameterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralParameterIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralParameterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
