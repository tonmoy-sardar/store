import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  isLoggedin: boolean;
  ngOnInit() {
    if(localStorage.getItem('isLoggedin')){
      this.isLoggedin = true
    }
  }

  openLogin() {
    this.dialog.open(
      LoginComponent, {
        width: '480px', panelClass: 'popup_wrapper', disableClose: true
      }
    );
  }

  logout(){
    localStorage.removeItem('isLoggedin')
  }

}
