import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierresIndexComponent } from './cierres-index.component';

describe('CierresIndexComponent', () => {
  let component: CierresIndexComponent;
  let fixture: ComponentFixture<CierresIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CierresIndexComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CierresIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
