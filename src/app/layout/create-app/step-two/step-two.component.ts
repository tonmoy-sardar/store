import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  bizChecked;
  constructor() { }

  ngOnInit() {
    this.bizChecked =false;
  }

}
