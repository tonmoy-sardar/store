import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from "../../services/login.service"
import { identifierModuleUrl } from '@angular/compiler';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {
  form: FormGroup;
  otpForm:FormGroup;
  passwordForm:FormGroup;
  user_id: string;
  error_msg: string;

  processing = false;
  showOtpSection = false;
  newPwdSection = false;
  contact_no;
  otp_check;
  
  otp: string;
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      contact_no: ['', Validators.required]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      conf_password: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched);
  }
  isFieldValid1(field: string) {
    return !this.otpForm.get(field).valid && (this.otpForm.get(field).dirty || this.otpForm.get(field).touched);
  }
  isFieldValid2(field: string) {
    return !this.passwordForm.get(field).valid && (this.passwordForm.get(field).dirty || this.passwordForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
      'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
    };
  }

  displayFieldCss1(field: string) {
    return {
      'is-invalid': this.otpForm.get(field).invalid && (this.otpForm.get(field).dirty || this.otpForm.get(field).touched),
      'is-valid': this.otpForm.get(field).valid && (this.otpForm.get(field).dirty || this.otpForm.get(field).touched)
    };
  }

  displayFieldCss2(field: string) {
    return {
      'is-invalid': this.passwordForm.get(field).invalid && (this.passwordForm.get(field).dirty || this.passwordForm.get(field).touched),
      'is-valid': this.passwordForm.get(field).valid && (this.passwordForm.get(field).dirty || this.passwordForm.get(field).touched)
    };
  }



  customerForgotPasswordOtp() {

    if (this.form.valid) {
      
      this.contact_no = this.form.value.contact_no;
      this.loginService.userForgetPasswordOtp(this.form.value).subscribe(
        res => {
          this.otp = res.otp
          this.showOtpSection = true;
         
        },
        error => {
          this.toastr.error(error.error.msg, '', {
            timeOut: 3000,
          });
        }
      )
    }
    else {
      this.markFormGroupTouched(this.form)
    }
  }

  resendOtp() {
    var data = {
      contact_no: this.contact_no
    }
    this.loginService.userForgetPasswordOtp(data).subscribe(
      res => {
        
        this.otp = res.otp
        this.showOtpSection = true;
      },
      error => {
        
        this.toastr.error(error.error.msg, '', {
          timeOut: 3000,
        });
      }
    )
  }

  submitOtp() {
    if (this.otp == this.otpForm.value.otp) {

      this.newPwdSection = true;
      this.otp_check = 1;
    }
    else {

      this.toastr.error('Please Enter Valid OTP', '', {
        timeOut: 3000,
      });
      
     
    }
  }
  submitNewPwd() {

    if (this.passwordForm.valid) {
      if (this.passwordForm.value.conf_password != this.passwordForm.value.password) {
        
        
        this.toastr.error('Password & Confirm Password are not same', '', {
          timeOut: 3000,
        });
      }
      else {
       
        var data = {
          contact_no: this.contact_no,
          otp_check: this.otp_check,
          password: this.passwordForm.value.password
        }
        this.loginService.userForgetPasswordUpdate(data).subscribe(
          res => {  
            this.dialogRef.close();
            this.toastr.success('Password has been successfully changed.', '', {
              timeOut: 3000,
            });
            this.router.navigateByUrl('/');
          },
          error => {
            this.toastr.error(error.error.msg, '', {
              timeOut: 3000,
            });
           
          }
        )

      }

    }
    else {
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

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  modalClose() {
    this.dialogRef.close();
  }

}
