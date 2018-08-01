import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateAppService } from "../../services/create-app.service"
import { identifierModuleUrl } from '../../../../../node_modules/@angular/compiler';
@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent implements OnInit {
  form: FormGroup;
  user_id: string;
  error_msg: string;
  otp: string;
  constructor(
    public dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private createAppService: CreateAppService
  ) {
    this.user_id = data.user_id;
    this.otp = data.otp;
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
      var id = this.user_id;
      var data = {
        is_active: 1
      }
      if (this.otp == this.form.value.otp) {
        this.createAppService.confirmOtp(id, data).subscribe(
          res => {
            console.log(res);
            this.dialogRef.close(true);
          },
          error => {
            console.log(error)
          }
        )
      }
      else {
        this.error_msg = 'Please Enter Valid OTP';
      }

    } else {
      this.markFormGroupTouched(this.form)
    }

  }

  resendOtp() {

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
