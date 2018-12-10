import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyTreeComponent } from './reply-tree.component';

describe('ReplyTreeComponent', () => {
  let component: ReplyTreeComponent;
  let fixture: ComponentFixture<ReplyTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
