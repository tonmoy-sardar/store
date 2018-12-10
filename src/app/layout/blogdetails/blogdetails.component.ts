import { Component, OnInit,Input  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../../core/component/login/login.component';
import { BlogService } from '../../core/services/blog.service';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import * as Globals from '../../core/global';
//import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-blogdetails',
  templateUrl: './blogdetails.component.html',
  styleUrls: ['./blogdetails.component.scss']
})
export class BlogdetailsComponent implements OnInit {
  @Input() fburl = location.href;
  @Input() googleurl = location.href;
  @Input() twitterurl = location.href;
  @Input() text = '';
  isLoggedin: boolean;
  user_id: string;
  blogDetails: any = [];
  recentBlogList: any = [];
  imageBaseUrl: string;
  loggedIn: boolean;
  commentForm: FormGroup;
  replyForm: FormGroup;
  userId: number;
  userName: string;
  blogId: number;
  selectedToggleArea: number;
  
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private blogService: BlogService,
   // private meta: Meta
  ) {

    // this.meta.addTag({ name: 'og:title', content: 'Banao App Title' });
    // this.meta.addTag({ name: 'og:description', content: 'Banao App description' });
    // this.meta.addTag({ name: 'og:image', content: 'https://www.banaoapp.com/assets/images/logo-dark.png' });

    this.loadData();

  if (!window['fbAsyncInit']) {
  window['fbAsyncInit'] = function () {
    window['FB'].init({
      appId: '413420495745137d',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.0'
    });
  };
  }

  // load facebook sdk if required
  const fburl = 'https://connect.facebook.net/en_US/sdk.js';
  if (!document.querySelector(`script[src='${fburl}']`)) {
  let script = document.createElement('script');
  script.src = fburl;
  document.body.appendChild(script);
  }

   // load google plus sdk if required
   const googleurl = 'https://apis.google.com/js/platform.js';
   if (!document.querySelector(`script[src='${googleurl}']`)) {
       let script = document.createElement('script');
       script.src = googleurl;
       document.body.appendChild(script);
   }

   // load twitter sdk if required
   const twitterurl = 'https://platform.twitter.com/widgets.js';
   if (!document.querySelector(`script[src='${twitterurl}']`)) {
       let script = document.createElement('script');
       script.src = twitterurl;
       document.body.appendChild(script);
   }

  }
  

  ngOnInit() {
    this.imageBaseUrl = environment.imageBaseUrlBlog;
    if (sessionStorage.getItem('isLoggedin')) {
      this.loggedIn = true;
      this.user_id = sessionStorage.getItem('logedUserUserId');
    }
    else {
      this.user_id = "";
    }
    this.getBlogDetailss(this.route.snapshot.params['slug']);
    this.blogListMostRecents();

  }

  ngAfterViewInit(): void {
    // render facebook button
    window['FB'] && window['FB'].XFBML.parse();
    // render google plus button
    window['gapi'] && window['gapi'].plusone.go();
    // // render tweet button
    window['twttr'] && window['twttr'].widgets.load();
  } 

  loadData() {
    this.commentForm = this.formBuilder.group({
      title: ["", Validators.required],
      post_id: [""],
      user_id: [""],
      comment_parent: [""]
    });

    this.replyForm = this.formBuilder.group({
      title: ["", Validators.required],
      post_id: [""],
      user_id: [""],
      comment_parent: [""]
    });
    this.loadUserInfo();
  }

  loadUserInfo() {

    if (sessionStorage.getItem('logedUserUserId')) {
      this.userId = +sessionStorage.getItem('logedUserUserId');

    }

    if (sessionStorage.getItem('logedUserFirstName')) {
      this.userName = sessionStorage.getItem('logedUserFirstName');
    }

    if (sessionStorage.getItem('isLoggedin')) {
      this.loggedIn = true;
    }
  }

  getBlogDetailss(slug) {
    this.blogService.getBlogDetails(slug).subscribe(
      data => {

        this.blogDetails = data['result'];
        console.log("Blog Details ==>", this.blogDetails);
        this.blogId = data['result']['id'];

      },
      error => {

        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }

  blogListMostRecents() {
    this.blogService.mostRecentBlogList(this.user_id).subscribe(
      data => {
        this.recentBlogList = data['result'];
        console.log("Recent Blog List", this.recentBlogList);
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

  goToBlog(slug) {
    this.getBlogDetailss(slug);
  }

  comment() {
    console.log(this.commentForm);
    if (!this.loggedIn) {
      this.openLoginModal()
    }
    else {
      this.commentForm.patchValue({
        post_id: this.blogId,
        user_id: this.userId,
        comment_parent: ''
      })
      console.log("Comment Form ==", this.commentForm);
      if (this.commentForm.valid) {
        this.blogService.addcomment(this.commentForm.value).subscribe(
          res => {
            this.toastr.success('Comment has been submitted', '', {
              timeOut: 3000,
            });
            this.commentForm.reset();
            this.getBlogDetailss(this.route.snapshot.params['slug']);
          },
          error => {
            // console.log(error)
          }
        )

      } else {
        this.markFormGroupTouched(this.commentForm)
      }
    }

  }

  reply(comment) {
    if (!this.loggedIn) {
      this.openLoginModal()
    }
    else {
      if (this.replyForm.valid) {

      } else {
        this.markFormGroupTouched(this.replyForm)
      }
      this.replyForm.patchValue({
        post_id: this.blogId,
        user_id: this.userId,
        comment_parent: +comment['id']
      })
      console.log(this.replyForm);
      if (this.replyForm.valid) {
        this.blogService.addcomment(this.replyForm.value).subscribe(
          res => {
            // console.log(res);
            this.toastr.success('Comment has been submitted', '', {
              timeOut: 3000,
            });
            this.replyForm.reset();
            this.getBlogDetailss(this.route.snapshot.params['slug']);

          },
          error => {
            // console.log(error)
          }
        )

      } else {
        this.markFormGroupTouched(this.replyForm)
      }
    }

  }


  openLoginModal() {
    let dialogRef = this.dialog.open(LoginComponent, {
      width: '525px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result)
    })
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && (form.get(field).dirty || form.get(field).touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field).invalid && (form.get(field).dirty || form.get(field).touched),
      'is-valid': form.get(field).valid && (form.get(field).dirty || form.get(field).touched)
    };
  }

  toggleReplySec(id) {
    this.selectedToggleArea = id;
    this.replyForm.reset();
  }

  toggleSelectedToggleArea(id) {
    this.selectedToggleArea = id;
    this.replyForm.reset();
  }


  refreshAllData() {
    this.getBlogDetailss(this.route.snapshot.params['slug']);
  }



}
