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

  logoToUpload: File = null;
  ownerToUpload: File = null;

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
    username: '',
    users_pic: '',
    user_designation: '',
    user_locality: '',
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
      logo: [null],
      business_name: ['', Validators.required],
      business_description: ['', Validators.required]
    });

    this.stepThree = this._formBuilder.group({
      username: ['', Validators.required],
      users_pic: [null, Validators.required],
      user_designation: ['', Validators.required],
      user_locality: ['', Validators.required]
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

    if (localStorage.getItem('storeCreateAppStep')) {
      // this.stepper.selectedIndex = +localStorage.getItem('storeCreateAppStep')
    }

    this.stepper.selectedIndex = 0

    if (localStorage.getItem('storeCreateAppID')) {
      this.getLocalAppDetails((localStorage.getItem('storeCreateAppID')));
    }

    //this.getCategoryList();
  }

  getLocalAppDetails(id) {
    this.createAppService.getLocalAppDetails(id).subscribe(
      (data: any[]) => {
        console.log(data);


        this.setp_one_data.app_category = data[0].app_category[0].app_category;
        this.stepOne.patchValue({
          app_category: data[0].app_category[0].app_category
        });

        this.setp_two_data.logo = data[0].logo;
        this.setp_two_data.business_name = data[0].business_name;
        this.setp_two_data.business_description = data[0].business_description;

        // = {
        // logo:data.logo,
        // business_name: '',
        // business_description: '',
        // }
      },
      error => {

        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

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

  appLogoChange(logofile: FileList) {
    const reader = new FileReader();
    if (logofile && logofile.length) {
      const file = logofile.item(0);
      this.logoToUpload = file;
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

  ownerLogoChange(ownerfile: FileList) {
    const reader = new FileReader();
    if (ownerfile && ownerfile.length) {
      const file = ownerfile.item(0);
      this.ownerToUpload = file;
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.setp_three_data.users_pic = event.target.result;
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

      if (localStorage.getItem('storeSessionID') && localStorage.getItem('storeCreateAppID')) {
        this.storeCreateAppStep = this.storeCreateAppStep + 1;
        localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        let data = {
          app_category: this.stepOne.value.app_category
        }

        this.createAppService.editCategoryMaping(localStorage.getItem('storeCreateAppID'),data).subscribe(
          response => {
            this.toastr.success('Success', '', {
              timeOut: 3000,
            });

          },
          error => {
            this.toastr.error('Something went wrong', '', {
              timeOut: 3000,
            });
          }
        );
      }
      else {
        this.storeCreateAppStep = this.storeCreateAppStep + 1;
        localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        let data = {
          session_id: this.stepOne.value.session_id,
          app_category: [{ app_category: this.stepOne.value.app_category }]
        }

        this.createAppService.createTempApp(data).subscribe(
          response => {
            localStorage.setItem('storeCreateAppID', response.id);
            this.toastr.success('Success', '', {
              timeOut: 3000,
            });

          },
          error => {
            this.toastr.error('Something went wrong', '', {
              timeOut: 3000,
            });
          }
        );
      }
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
      this.storeCreateAppStep = this.storeCreateAppStep + 1;
      localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
      this.createAppService.logoUploadSection(localStorage.getItem('storeCreateAppID'), this.logoToUpload, this.stepTwo.value).subscribe(
        response => {
          this.toastr.success('Success', '', {
            timeOut: 3000,
          });

        },
        error => {
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );
    }
    else {
      this.markFormGroupTouched(this.stepTwo)
    }
  }

  submitStepThree() {
    if (this.stepThree.valid) {
      let data = {
        session_id: localStorage.getItem('storeSessionID'),
        username: this.stepThree.value.owner_name,
        user_locality: this.stepThree.value.business_locatioon,
        user_designation: this.stepThree.value.owner_designation,
        users_pic: this.stepThree.value.owner_logo,
      }
      this.createAppService.createLocalUser(localStorage.getItem('storeCreateAppID'), this.ownerToUpload, data).subscribe(
        response => {
          this.storeCreateAppStep = this.storeCreateAppStep + 1;
          localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });

        },
        error => {
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );
    }
    else {
      this.markFormGroupTouched(this.stepThree)
    }
  }

  goToStep(value) {
    this.storeCreateAppStep = value - 1;
    localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  submitStepFour() {
    if (this.stepFour.valid) {
      this.storeCreateAppStep = this.storeCreateAppStep + 1;

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
