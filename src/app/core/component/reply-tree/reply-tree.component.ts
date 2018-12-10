
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { BlogService } from '../../services/blog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reply-tree',
  templateUrl: './reply-tree.component.html',
  styleUrls: ['./reply-tree.component.scss']
})
export class ReplyTreeComponent implements OnInit {
  @Input('data') data: any;
  @Input('userName') userName: string;
  @Input('userId') userId: number;
  @Input('userPic') userPic: string;
  @Input('loggedIn') loggedIn: boolean;
  @Input('blogId') blogId: number;
  @Input('selectedToggleArea') selectedToggleArea: boolean;
  @Input('getSelectedToggleArea') getSelectedToggleArea: (id: number) => number;
  @Output('refreshData') refreshData = new EventEmitter();
  replyForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.replyForm = this.formBuilder.group({
      title: ["", Validators.required],
      post_id: [""],
      user_id: [""],
      comment_parent: [""]
    });
  }


  toggleReplySec(id) {
    this.selectedToggleArea = id;
    this.replyForm.reset();
    this.getSelectedToggleArea(id);
  }

  toggleSelectedToggleArea(id){
    this.selectedToggleArea = id;
    this.replyForm.reset();
  }
  
  refreshAllData(){
    this.refreshData.emit();
  }

  addReply(comment) {
    console.log(comment);
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
      if (this.replyForm.valid) {
        this.blogService.addcomment(this.replyForm.value).subscribe(
          res => {
             console.log(res);
             //this.getBlogDetailss(this.route.snapshot.params['slug']);
            this.toastr.success('Comment has been submitted', '', {
              timeOut: 3000,
            });
            this.replyForm.reset();
            this.refreshData.emit();
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


}
