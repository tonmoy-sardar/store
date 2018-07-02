import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'app';
  now: Date = new Date();
  currentDate;
  sessionID;

  constructor(

  ) { }

  ngOnInit() {
    this.sessionID = localStorage.getItem('storeSessionID');
    if (!this.sessionID) {
      this.currentDate = this.now.getTime();
      this.sessionID = this.currentDate.toString() + Math.floor((Math.random() * 1000000000) + 1);
      localStorage.setItem('storeSessionID', this.sessionID);
    }
    // console.log(this.sessionID);
  }

}
