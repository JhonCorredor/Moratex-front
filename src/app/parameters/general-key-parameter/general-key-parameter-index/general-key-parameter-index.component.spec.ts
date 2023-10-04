import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralKeyParameterIndexComponent } from './general-key-parameter-index.component';

describe('GeneralParameterIndexComponent', () => {
  let component: GeneralKeyParameterIndexComponent;
  let fixture: ComponentFixture<GeneralKeyParameterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralKeyParameterIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralKeyParameterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
