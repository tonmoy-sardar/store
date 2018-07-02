import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
          this.router.navigateByUrl('/dashboard');
        },
        error => {
          console.log(error)
        }
      );
    } else {
      this.markFormGroupTouched(this.form)
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

}
