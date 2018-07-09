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
  haveBusinessName;
  haveBusinessDescription;
  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;
  stepFour: FormGroup;
  stepFive: FormGroup;
  category_list: any = [];
  business_photo_arr = [];

  logoToUpload: File = null;
  ownerToUpload: File = null;

  storeCreateAppStep;

  user_id;

  setp_one_data = {
    session_id: '',
    app_category: ''
  }

  setp_two_data = {
    logo: '',
    business_name: '',
    business_description: '',
    business_photos: [],
  }

  setp_three_data = {
    owner_name: '',
    owner_pic: '',
    owner_designation: ''
  }

  setp_four_data = {
    website_url: ''
  }

  setp_five_data = {
    contact_no: '',
    email_id: ''
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
      logo: [''],
      business_name: ['', Validators.required],
      business_description: [''],
      business_photos: [''],
    });

    this.stepThree = this._formBuilder.group({
      owner_name: ['', Validators.required],
      owner_pic: [''],
      owner_designation: [''],
    });


    this.stepFour = this._formBuilder.group({
      business_photos: [''],
      website_url: ['', Validators.required]
    });

    this.stepFive = this._formBuilder.group({
      email_id: ['', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
      ]],
      contact_no: ['', [
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
      //alert(localStorage.getItem('storeCreateAppStep'));
      this.storeCreateAppStep = localStorage.getItem('storeCreateAppStep')
      this.stepper.selectedIndex =  parseInt(this.storeCreateAppStep)
    }

    if (localStorage.getItem('storeCreateAppID')) {
      this.getTempAppDetails((localStorage.getItem('storeCreateAppID')));
    }

    if (localStorage.getItem('storeSessionID')) {
      this.getTempUserDetails(localStorage.getItem('storeSessionID'));
    }

    this.getCategoryList();
  }

  checkBusinessName()
  {
   
    if(this.setp_two_data.business_name!=null && this.setp_two_data.business_name.length>0)
    {
     this.haveBusinessName=true;
    }
    else{
     this.haveBusinessName=false;
    }
  }

  checkBusinessDescription()
  {
   
    if(this.setp_two_data.business_description!=null && this.setp_two_data.business_description.length>0)
    {
     this.haveBusinessDescription=true;
    }
    else{
     this.haveBusinessDescription=false;
    }
  }

  getTempUserDetails(id) {
    this.createAppService.getTempUserDetails(id).subscribe(
      (data: any[]) => {
        console.log(data);
        if (data.length > 0) {
          this.setp_three_data.owner_pic = data[0].owner_pic;
          this.setp_three_data.owner_name = data[0].owner_name;
          this.setp_three_data.owner_designation = data[0].owner_designation;
          this.user_id = data[0].id;
        }
      },
      error => {
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };


  getTempAppDetails(id) {
    this.createAppService.getTempAppDetails(id).subscribe(
      (data: any[]) => {
        console.log(data);


        this.setp_one_data.app_category = data[0].app_category.id;
        this.stepOne.patchValue({
          app_category: data[0].app_category.id
        });

        this.setp_two_data.logo = data[0].appmaster.logo;
        this.setp_two_data.business_name = data[0].appmaster.business_name;
        this.setp_two_data.business_description = data[0].appmaster.business_description;

        this.setp_four_data.website_url = data[0].appmaster.website_url;


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
        this.setp_three_data.owner_pic = event.target.result;
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
          this.setp_two_data.business_photos.push(event.target.result)
        }
        this.business_photo_arr.push(event.target.files[i]);
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

  getSuggestedUrl(url: string){
    return url.replace(/\s/g, "").toLowerCase();
  }

  getWebUrl(url: string) {
    this.setp_four_data.website_url = url.replace(/\s/g, "").toLowerCase();
  }

  submitStepOne() {
    if (this.stepOne.valid) {

      if (localStorage.getItem('storeSessionID') && localStorage.getItem('storeCreateAppID')) {
        this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
        localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        let data = {
          app_category: this.stepOne.value.app_category
        }

        this.createAppService.editCategoryMaping(localStorage.getItem('storeCreateAppID'), data).subscribe(
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
        this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
        localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        let data = {
          session_id: this.stepOne.value.session_id,
          app_category: this.stepOne.value.app_category
        }

        this.createAppService.createTempApp(data).subscribe(
          response => {
            console.log(response);
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
      this.toastr.error('Please select a app type', '', {
        timeOut: 3000,
      });
      this.markFormGroupTouched(this.stepOne)
    }
  }

  submitStepTwo() {

    if (this.stepTwo.valid) {
      
      this.createAppService.logoUploadSection(localStorage.getItem('storeCreateAppID'), this.logoToUpload, this.stepTwo.value).subscribe(
        response => {

          this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
          localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
          this.toastr.success('Success', '', {
            timeOut: 3000,
          });

          for (let i = 0; i < this.business_photo_arr.length; i++) {
            this.createAppService.uploadBusinessImages(localStorage.getItem('storeCreateAppID'), this.business_photo_arr[i]).subscribe(
              response => {
                // this.toastr.success('Success2', '', {
                //   timeOut: 3000,
                // });
              },
              error => {
                this.toastr.error('Something went wrong', '', {
                  timeOut: 3000,
                });
              }
            );
          }
          

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

      this.createAppService.createLocalUser(localStorage.getItem('storeSessionID'), this.ownerToUpload, this.stepThree.value).subscribe(
        response => {
          this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
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
    this.storeCreateAppStep = parseInt(value) - 1;
    localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  submitStepFour() {
    if (this.stepFour.valid) {

      var data = {
        id: localStorage.getItem('storeCreateAppID'),
        app_url: this.stepFour.value.website_url
      }
      this.createAppService.updateTempAppURL(data).subscribe(
        response => {

        },
        error => {
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );

    }
    else {

      this.markFormGroupTouched(this.stepFive)
    }
  }

  submitStepFive() {
    if (this.stepFive.valid) {
      let data = {
        id: this.user_id,
        email_id: this.stepFive.value.email_id,
        contact_no: this.stepFive.value.contact_no
      }
      this.createAppService.createOriginalApp(data).subscribe(
        response => {
          // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
          // localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);

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
      this.markFormGroupTouched(this.stepFive)
    }
  }
}
