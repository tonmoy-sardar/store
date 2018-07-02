import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  now: Date = new Date();
  currentDate;
  currentTimeStamp;
  sessionID;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

    this.sessionID = localStorage.getItem('storeSessionID');
    if(!this.sessionID)
    {
      this.currentDate = this.now.getTime();
      this.sessionID =  this.currentDate.toString() +  Math.floor((Math.random() * 1000000000) + 1);
      localStorage.setItem('storeSessionID', this.sessionID);
    }
    console.log(this.sessionID);
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };
}
