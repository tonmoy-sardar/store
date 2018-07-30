import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FranchiseUserService } from "../../core/services/franchise-user.service"
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-franchise-user',
  templateUrl: './franchise-user.component.html',
  styleUrls: ['./franchise-user.component.scss']
})
export class FranchiseUserComponent implements OnInit {

  FranchiseUserList: any = [];
  userAndAppDetails;
  urlEndpoint;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private franchiseUserService: FranchiseUserService,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
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
    console.log(localStorage.getItem('logedUserUserId'))
    this.getFranchiseUserList(localStorage.getItem('logedUserUserId'))
    this.getAppAnduserDetailsByUserID(localStorage.getItem('logedUserUserId'));
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
