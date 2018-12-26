import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SeoserviceService } from '../../core/services/seoservice.service';

@Component({
  selector: 'app-your-expense',
  templateUrl: './your-expense.component.html',
  styleUrls: ['./your-expense.component.scss']
})
export class YourExpenseComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _seoService: SeoserviceService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });
  }


  btnClickNav(toNav) {
    alert(toNav)
    this.router.navigateByUrl('/' + toNav);
  };
}
