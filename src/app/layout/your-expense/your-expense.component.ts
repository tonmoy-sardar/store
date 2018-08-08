import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-your-expense',
  templateUrl: './your-expense.component.html',
  styleUrls: ['./your-expense.component.scss']
})
export class YourExpenseComponent implements OnInit {

  constructor( private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {
  }


  btnClickNav(toNav) {
    alert(toNav)
    this.router.navigateByUrl('/' + toNav);
  };
}
