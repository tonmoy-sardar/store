import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private loginService: LoginService,
    public router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  modalClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      this.loginService.login(this.form.value).subscribe(
        response => {
          console.log(response);
          this.toastr.success('Login successfully', '', {
            timeOut: 3000,
          });
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('logedUserEmail', response.email);
          localStorage.setItem('logedUserFirstName', response.first_name);
          localStorage.setItem('logedUserLastName', response.last_name);
          localStorage.setItem('logedUserFullName', response.first_name + ' ' + response.last_name);
          localStorage.setItem('logedUserToken', response.token);
          localStorage.setItem('logedUserUserId', response.user_id);
          localStorage.setItem('logedUserUserName', response.username);
          localStorage.setItem('logedUserContactNo', response.contact_no);
          this.dialogRef.close();

          if (response.group.toLowerCase() == "franchise") {
            localStorage.setItem('logedUserUserGroup', response.group.toLowerCase());
            this.loginService.loginStatus(true);
            this.router.navigateByUrl('/');
          }
          else {
            this.loginService.loginStatus(true);
            this.router.navigateByUrl('/');
          }

        },
        error => {
          console.log(error)
          this.loginService.loginStatus(false);
          this.toastr.error(error.error.message, '', {
            timeOut: 3000,
          });
        }
      );
    } else {
      this.markFormGroupTouched(this.form)
      this.loginService.loginStatus(false);
    }

  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }


  forgotPassword() {
    this.dialogRef.close();
    this.dialog.open(
      ForgotPasswordDialogComponent, {
        width: '480px', panelClass: 'popup_wrapper', disableClose: true
      }
    );
  }

}
