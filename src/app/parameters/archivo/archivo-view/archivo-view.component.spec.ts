import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosViewComponent } from './archivo-view.component';

describe('ArchivosViewComponent', () => {
  let component: ArchivosViewComponent;
  let fixture: ComponentFixture<ArchivosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
