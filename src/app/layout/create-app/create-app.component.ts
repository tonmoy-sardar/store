import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { PlatformLocation } from '@angular/common';

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
  stepFour: FormGroup;
  stepFive: FormGroup;
  category_list: any = [];
  storeCreateAppStep;

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

  setp_four_data = {
    business_photos: [],
    established_year: '',
    website_url: ''
  }

  setp_five_data = {
    mobile: '',
    email: ''
  }

  base_url: string;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private platformLocation: PlatformLocation
  ) { }

  ngOnInit() {
    this.storeCreateAppStep = 0;
    this.base_url = (this.platformLocation as any).location.origin;

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

    this.stepFour = this._formBuilder.group({
      business_photos: [null, Validators.required],
      established_year: ['', Validators.required],
      website_url: ['', Validators.required]
    });

    this.stepFive = this._formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
      ]],
      mobile: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(12)
      ]],
    });

    this.stepOne.patchValue({
      session_id: localStorage.getItem('storeSessionID')
    });

    this.setp_one_data.session_id = localStorage.getItem('storeSessionID');
    
    if(localStorage.getItem('storeCreateAppStep')){
      this.stepper.selectedIndex = +localStorage.getItem('storeCreateAppStep')
    }

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

  businessPhotoChange(event) {
    if (event.target.files && event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.setp_four_data.business_photos.push(event.target.result)
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();

    }
  }

  categorySelect(id) {
    this.setp_one_data.app_category = id
    this.stepOne.patchValue({
      app_category: id
    });
  }

  getWebUrl(url: string) {
    this.setp_four_data.website_url = url;
  }

  submitStepOne() {
    if (this.stepOne.valid) {

      this.storeCreateAppStep =  this.storeCreateAppStep +1;

      // if(this.storeCreateAppStep>0)
      // {
      //   this.storeCreateAppStep =  this.storeCreateAppStep +1;
      //   localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
      //   let data = {
      //     session_id:this.stepOne.value.session_id,
      //     app_category: [{app_category:this.stepOne.value.app_category}]
      //   }
      
      //   this.createAppService.createTempApp(data).subscribe(
      //     response => {
      //       this.toastr.success('Success', '', {
      //         timeOut: 3000,
      //       });
          
      //     },
      //     error => {
      //       this.toastr.error('Something went wrong', '', {
      //         timeOut: 3000,
      //       });
      //     }
      //   );
      // }
      // else
      // {
      //   this.storeCreateAppStep =  this.storeCreateAppStep +1;
      //   localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
      //   let data = {
      //     session_id:this.stepOne.value.session_id,
      //     app_category: [{app_category:this.stepOne.value.app_category}]
      //   }
      
      //   this.createAppService.createTempApp(data).subscribe(
      //     response => {
      //       this.toastr.success('Success', '', {
      //         timeOut: 3000,
      //       });
          
      //     },
      //     error => {
      //       this.toastr.error('Something went wrong', '', {
      //         timeOut: 3000,
      //       });
      //     }
      //   );
      // }
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
      this.storeCreateAppStep =  this.storeCreateAppStep +1;
    }
    else {
      this.markFormGroupTouched(this.stepTwo)
    }
  }

  submitStepThree() {
    if (this.stepThree.valid) {
      this.storeCreateAppStep =  this.storeCreateAppStep +1;
    }
    else {
      this.markFormGroupTouched(this.stepThree)
    }
  }

  goToStep(value)
  {
    this.storeCreateAppStep =  value - 1;
  }

  submitStepFour() {
    if (this.stepFour.valid) {
      this.storeCreateAppStep =  this.storeCreateAppStep +1;
      
    }
    else {
      this.markFormGroupTouched(this.stepFour)
    }
  }

  submitStepFive() {
    if (this.stepFive.valid) {
      
    }
    else {
      this.markFormGroupTouched(this.stepFive)
    }
  }
}
