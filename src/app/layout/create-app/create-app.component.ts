import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAppService } from '../../core/services/create-app.service';

@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit {
  isLinear = false;
  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;
  category_list: any = [];
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
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.stepOne = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
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

    this.getCategoryList();
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  getCategoryList() {
    this.createAppService.getCategoryList().subscribe(
      res => {
        // console.log(res)
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
}
