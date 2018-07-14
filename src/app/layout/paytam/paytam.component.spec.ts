import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytamComponent } from './paytam.component';

describe('PaytamComponent', () => {
  let component: PaytamComponent;
  let fixture: ComponentFixture<PaytamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
