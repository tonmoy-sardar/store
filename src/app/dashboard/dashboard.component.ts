import { Component, OnInit } from '@angular/core';
import { SeoserviceService } from '../core/services/seoservice.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private _seoService: SeoserviceService
  ) { 
    
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });
  }

}
