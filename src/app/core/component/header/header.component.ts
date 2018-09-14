import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CreateAppService } from '../../services/create-app.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private loginService: LoginService,
    private createAppService: CreateAppService
  ) {

    loginService.getLoggedInStatus.subscribe(status => this.changeStatus(status));
  }
  isLoggedin: boolean;
  user_name: string;
  user_group: string = '';

  loginStatus: boolean;
  userAndAppDetails: any;
  app_exist_key: boolean;
  private changeStatus(status: boolean): void {
    this.loginStatus = status;
    if (this.loginStatus == true) {
      this.ngOnInit();
    }

    //alert(this.userName)
  }

  ngOnInit() {
    if (sessionStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = sessionStorage.getItem('logedUserFirstName');
      if (sessionStorage.getItem('logedUserUserGroup')) {
        this.user_group = sessionStorage.getItem('logedUserUserGroup')
      }
      this.getAppAnduserDetailsByUserID(sessionStorage.getItem('logedUserUserId'))
    }
  }

  getAppAnduserDetailsByUserID(id) {
    this.createAppService.getAppAnduserDetailsByUserID(id).subscribe(
      (data) => {
        console.log(data);
        this.userAndAppDetails = data;
        if (data.user_details.length > 0) {
          if (data.user_details[0].app_details.length > 0) {
            this.app_exist_key = true;
          }
        }
      },
      error => {

      }
    );
  };

  openLogin() {
    this.dialog.open(
      LoginComponent, {
        width: '480px', panelClass: 'popup_wrapper', disableClose: true
      }
    );
  }

  logout() {
    this.isLoggedin = false;
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

}
