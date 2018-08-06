import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog,private router: Router) { }
  isLoggedin: boolean;
  user_name: string;
  user_group: string = '';
  ngOnInit() {
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = localStorage.getItem('logedUserFullName');
      if(localStorage.getItem('logedUserUserGroup')){
        this.user_group = localStorage.getItem('logedUserUserGroup')
      }
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
    this.isLoggedin = false;
    // localStorage.removeItem('isLoggedin');
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}
