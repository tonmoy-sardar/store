import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseClubComponent } from './franchise-club.component';

describe('FranchiseClubComponent', () => {
  let component: FranchiseClubComponent;
  let fixture: ComponentFixture<FranchiseClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseClubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchiseClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
