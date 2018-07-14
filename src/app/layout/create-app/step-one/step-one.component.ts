import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateAppService } from '../../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  stepOne: FormGroup;
  setp_one_data = {
    session_id: '',
    app_category: ''
  }
  storeCreateAppStep;
  session_id;

  category_list: any = [];
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.storeCreateAppStep = 0;
    this.session_id = localStorage.getItem('storeSessionID');

    this.stepOne = this._formBuilder.group({
      session_id: ['', Validators.required],
      app_category: ['', Validators.required]
    });

    this.stepOne.patchValue({
      session_id: localStorage.getItem('storeSessionID')
    });

    this.setp_one_data.session_id = localStorage.getItem('storeSessionID');

    if (localStorage.getItem('storeCreateAppID')) {
      this.getTempAppDetails((localStorage.getItem('storeCreateAppID')));
    }

    this.getCategoryList();
  }

  getTempAppDetails(id) {
    this.createAppService.getTempAppDetails(id).subscribe(
      (data: any[]) => {

        this.setp_one_data.app_category = data[0].app_category[0].app_category;
        this.stepOne.patchValue({
          app_category: data[0].app_category[0].app_category
        });

        
      },
      error => {

        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

  categorySelect(id) {
    this.setp_one_data.app_category = id
    this.stepOne.patchValue({
      app_category: id
    });
  }
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

  submitStepOne() {

    
    // if (this.stepOne.valid) {

    //   if (localStorage.getItem('storeSessionID') && localStorage.getItem('storeCreateAppID')) {
    //     this.storeCreateAppStep = this.storeCreateAppStep + 1;
    //     localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
    //     let data = {
    //       app_category: this.stepOne.value.app_category
    //     }

    //     this.createAppService.editCategoryMaping(localStorage.getItem('storeCreateAppID'),data).subscribe(
    //       response => {
    //         this.toastr.success('Success', '', {
    //           timeOut: 3000,
    //         });

    //       },
    //       error => {
    //         this.toastr.error('Something went wrong', '', {
    //           timeOut: 3000,
    //         });
    //       }
    //     );
    //   }
    //   else {
    //     this.storeCreateAppStep = this.storeCreateAppStep + 1;
    //     localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
    //     let data = {
    //       session_id: this.stepOne.value.session_id,
    //       app_category: [{ app_category: this.stepOne.value.app_category }]
    //     }

    //     this.createAppService.createTempApp(data).subscribe(
    //       response => {
    //         localStorage.setItem('storeCreateAppID', response.id);
    //         this.toastr.success('Success', '', {
    //           timeOut: 3000,
    //         });

    //       },
    //       error => {
    //         this.toastr.error('Something went wrong', '', {
    //           timeOut: 3000,
    //         });
    //       }
    //     );
    //   }
    // }
    // else {
    //   this.toastr.error('Please select a category', '', {
    //     timeOut: 3000,
    //   });
    //   this.markFormGroupTouched(this.stepOne)
    // }
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

}
