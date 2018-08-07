import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourExpenseComponent } from './your-expense.component';

describe('YourExpenseComponent', () => {
  let component: YourExpenseComponent;
  let fixture: ComponentFixture<YourExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
