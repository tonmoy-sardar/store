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
  user_name: string;
  ngOnInit() {
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = localStorage.getItem('logedUserUserName')
    }
  }

  openLogin() {
    this.dialog.open(
      LoginComponent, {
        width: '480px', panelClass: 'popup_wrapper', disableClose: true
      }
    );
  }

  logout() {
    this.isLoggedin = false
    localStorage.removeItem('isLoggedin')
  }

}
