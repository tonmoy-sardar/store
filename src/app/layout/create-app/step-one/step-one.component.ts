import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

}
