import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  isLinear = true;
  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;
  category_list: any = [];

  setp_one_data = {
    session_id: '',
    app_category: ''
  }

  setp_two_data = {
    logo: '',
    business_name: '',
    business_description: '',
  }

  setp_three_data = {
    owner_name: '',
    owner_logo: '',
    owner_designation: '',
    business_locatioon: '',
  }

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.stepOne = this._formBuilder.group({
      session_id: ['', Validators.required],
      app_category: ['', Validators.required]
    });

    this.stepTwo = this._formBuilder.group({
      logo: [null, Validators.required],
      business_name: ['', Validators.required],
      business_description: ['', Validators.required]
    });

    this.stepThree = this._formBuilder.group({
      owner_name: ['', Validators.required],
      owner_logo: [null, Validators.required],
      owner_designation: ['', Validators.required],
      business_locatioon: ['', Validators.required]
    });
    this.stepOne.patchValue({
      session_id: localStorage.getItem('storeSessionID')
    });
    this.setp_one_data.session_id = localStorage.getItem('storeSessionID');
    // this.stepper.selectedIndex = 3;
    this.getCategoryList();
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  getCategoryList() {
    this.createAppService.getCategoryList().subscribe(
      res => {
        this.category_list = res;
      },
      error => {
        console.log(error)
      }
    )
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

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  appLogoChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.setp_two_data.logo = event.target.result;
        // this.stepTwo.patchValue({
        //   logo: reader.result
        // });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  ownerLogoChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.setp_three_data.owner_logo = event.target.result;
        // this.stepThree.patchValue({
        //   owner_logo: reader.result
        // });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  categorySelect(id) {
    this.setp_one_data.app_category = id
    this.stepOne.patchValue({
      app_category: id
    });
  }

  submitStepOne() {
    if (this.stepOne.valid) {

    }
    else {
      this.toastr.error('Please select a category', '', {
        timeOut: 3000,
      });
      this.markFormGroupTouched(this.stepOne)
    }
  }

  submitStepTwo() {
    if (this.stepTwo.valid) {

    }
    else {
      this.markFormGroupTouched(this.stepTwo)
    }
  }

  submitStepThree() {
    if (this.stepThree.valid) {

    }
    else {
      this.markFormGroupTouched(this.stepThree)
    }
  }
}
