import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FranchiseUserService } from "../../core/services/franchise-user.service"
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { SeoserviceService } from '../../core/services/seoservice.service';

@Component({
  selector: 'app-franchise-user',
  templateUrl: './franchise-user.component.html',
  styleUrls: ['./franchise-user.component.scss']
})
export class FranchiseUserComponent implements OnInit {

  FranchiseUserList: any = [];
  userAndAppDetails;
  urlEndpoint;
  isLoggedin: boolean;
  user_name: string;
  user_group: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private franchiseUserService: FranchiseUserService,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
    private _seoService: SeoserviceService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });

    if (sessionStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = sessionStorage.getItem('logedUserUserName');
      if(sessionStorage.getItem('logedUserUserGroup')){
        this.user_group = sessionStorage.getItem('logedUserUserGroup')
      }
    }
    this.urlEndpoint = environment.urlEndpoint;

    this.userAndAppDetails = {
      first_name: '',
      user_details: [{
        users_pic: '',
        contact_no: '',
        app_details: [{
          id: '',
          app_name: '',
          logo: ''
        }]
      }]
    }
    
    this.getFranchiseUserList(sessionStorage.getItem('logedUserUserId'))
    this.getAppAnduserDetailsByUserID(sessionStorage.getItem('logedUserUserId'));
  }

  logout() {
    this.isLoggedin = false;
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }


  getFranchiseUserList(id) {
    this.franchiseUserService.getFranchiseUserList(id).subscribe(
      (res: any[]) => {
        this.FranchiseUserList = res;
        console.log(res)
      },
      error => {
        console.log(error)
      }
    )
  }

  getAppAnduserDetailsByUserID(id) {
    this.createAppService.getAppAnduserDetailsByUserID(id).subscribe(
      (data: any[]) => {
        console.log(data);
        this.userAndAppDetails = data;
      },
      error => {

        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

}
