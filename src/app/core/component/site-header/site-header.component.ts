import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit {
  isLoggedin: boolean;
  user_name: string;
  user_group: string = '';
  constructor(public dialog: MatDialog,private router: Router) { }

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
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}