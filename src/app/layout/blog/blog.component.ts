import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../../core/component/login/login.component';
import { BlogService } from '../../core/services/blog.service';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import * as Globals from '../../core/global';
import { SeoserviceService } from '../../core/services/seoservice.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  isLoggedin: boolean;
  user_name: string;
  allBlogList:any = [];
  allCategoryList:any =[];
  imageBaseUrl: string;
  paginationMaxSize: number;
  itemPerPage: number;
  defaultPagination: number;
  itemNo: number;
  lower_count: number;
  upper_count: number;
  allBlogListCount:any;
  allBlogLength:any;
  blogname:string;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private blogService: BlogService,
    private _seoService: SeoserviceService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });

    this.itemNo = 0;
    this.defaultPagination = 1;
    this.paginationMaxSize = Globals.paginationMaxSize;
    this.itemPerPage = Globals.itemPerPage;
    this.imageBaseUrl = environment.imageBaseUrlBlog;
    if (sessionStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = sessionStorage.getItem('logedUserUserName')
    }
    else {

    }
    this.allBlogListing();
    this.getCategories();
    this.blogname ="";
  }

  allBlogListing() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', this.defaultPagination.toString());
    this.blogService.getBlogList(params).subscribe(
      data => {
        
        this.allBlogList = data['result']['bloglist'];
        this.allBlogLength = data['result'].length;
        this.allBlogListCount =  data['result']['total_count'];
        this.itemNo = (this.defaultPagination - 1) * this.itemPerPage;
        this.lower_count = this.itemNo + 1;
        if (this.allBlogListCount > this.itemPerPage * this.defaultPagination) {
          this.upper_count = this.itemPerPage * this.defaultPagination
        }
        else {
          this.upper_count = this.allBlogListCount;
        }
      },
      error => {
       
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }

  getCategories() {
    this.blogService.getCategory().subscribe(
      data => {
        this.allCategoryList = data['result'];
      },
      error => {
       
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }

  getCatwiseBlog(catslug) {
    this.blogService.getBlogCategoryWise(catslug).subscribe(
      data => {
        this.allBlogList = data['result']['bloglist'];
      },
      error => {
       
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }
  SearchBlog(blogname) {
    this.blogService.blogSearch(blogname).subscribe(
      data => {
        this.allBlogList = data['result']['bloglist'];
        console.log("Search Result",this.allBlogList );
      },
      error => {
       
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }
  transformDate(date) {
    var now = moment()
    var blog_date = moment.utc(date).local()
    if (moment(now).format('l') == moment(blog_date).format('l')) {
      return moment(blog_date).startOf('hour').fromNow();
    }
    else {
      return moment(blog_date).format('ll');
    }
  }
  pagination() {
    //window.scroll(0,500);
    this.allBlogListing();
  };


}
