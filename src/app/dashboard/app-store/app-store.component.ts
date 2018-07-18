import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-app-store',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss']
})
export class AppStoreComponent implements OnInit {

  userAndAppDetails;
  urlEndpoint;
  constructor(
    private router: Router,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.urlEndpoint=environment.urlEndpoint;
    
    this.userAndAppDetails ={
      first_name:'',
      user_details:[{
        users_pic:'',
        contact_no:'',
        app_details:[{
          id:'',
          app_name:'',
          logo:''
        }]
      }]
    }
    this.getAppAnduserDetailsByUserID(localStorage.getItem('logedUserUserId'));
  }

  getAppAnduserDetailsByUserID(id)
  {
    this.createAppService.getAppAnduserDetailsByUserID(id).subscribe(
      (data: any[]) => {
        console.log(data);

        this.userAndAppDetails=data;


      },
      error => {

        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };
}
