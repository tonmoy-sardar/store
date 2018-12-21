import { Component, OnInit } from '@angular/core';
import { CreateAppService } from "../../core/services/create-app.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingState } from '../../core/component/loading/loading.component';
import { SeoserviceService } from '../../core/services/seoservice.service';

@Component({
  selector: 'app-app-success',
  templateUrl: './app-success.component.html',
  styleUrls: ['./app-success.component.scss']
})
export class AppSuccessComponent implements OnInit {
  url: string;
  base_url: string;
  status;
  statusStr;
  app_id;
  app_details;
  loading: LoadingState = LoadingState.NotReady;
  constructor(
    private createAppService: CreateAppService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _seoService: SeoserviceService
  ) {
    //console.log('Called Constructor');
    this.route.params.subscribe(params => {
        this.status = params['status'];
        this.app_id = params['app_id'];
    });
   }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });
    
    if(this.status=='TXN_SUCCESS')
    {
      this.statusStr = 'Success';
    }
    else if(this.status=='TXN_FAILURE')
    {
      this.statusStr = 'Failure';
    }
    else
    {
      this.statusStr = 'Pending';
    }

    console.log(this.status);
    console.log(this.app_id);
    this.getAppDetails(this.app_id);
  }

  getAppDetails(id) {
    this.loading = LoadingState.Processing;
    this.createAppService.getAppDetails(id).subscribe(
      data => {
        this.loading = LoadingState.Ready;
        console.log(data);
        this.app_details = data;
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }


}
