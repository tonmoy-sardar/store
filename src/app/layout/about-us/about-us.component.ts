import { Component, OnInit } from '@angular/core';
import { SeoserviceService } from '../../core/services/seoservice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(
    private _seoService: SeoserviceService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });
  }

}
