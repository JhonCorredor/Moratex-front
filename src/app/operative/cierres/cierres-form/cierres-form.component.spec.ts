import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierresFormComponent } from './cierres-form.component';

describe('CierresFormComponent', () => {
  let component: CierresFormComponent;
  let fixture: ComponentFixture<CierresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CierresFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CierresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
