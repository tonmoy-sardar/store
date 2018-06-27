import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

}
