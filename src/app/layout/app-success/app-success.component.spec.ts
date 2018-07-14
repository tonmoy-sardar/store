import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSuccessComponent } from './app-success.component';

describe('AppSuccessComponent', () => {
  let component: AppSuccessComponent;
  let fixture: ComponentFixture<AppSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
