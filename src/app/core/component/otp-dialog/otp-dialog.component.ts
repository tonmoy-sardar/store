import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateAppService } from "../../services/create-app.service"
import { identifierModuleUrl } from '../../../../../node_modules/@angular/compiler';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent implements OnInit {
  form: FormGroup;
  email_id: string;
  user_id:string;
  contact_no: string;
  error_msg: string;
  otp: string;
  constructor(
    public dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
  ) {
    this.contact_no = data.contact_no;
    this.email_id = data.email_id;
    this.otp = data.otp;
    this.user_id = data.user_id
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      otp: [null, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      
      if (this.otp == this.form.value.otp) {
        this.dialogRef.close(true);
      }
      else {
        this.error_msg = "Please Enter Valid OTP";
      }

    } else {
      this.markFormGroupTouched(this.form)
    }

  }

  resendOtp() {
    let data = {
      user_id: this.user_id,
      email_id: this.email_id,
      contact_no: this.contact_no
    }
    this.createAppService.sendAppCreateOtp(data).subscribe(
      response => {
        this.otp = response['otp']
      },
      error => {
       
        this.toastr.error(error.error.msg, '', {
          timeOut: 3000,
        });
      }
    );

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
