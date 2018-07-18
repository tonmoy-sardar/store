import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CreateAppService } from '../../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { PlatformLocation } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit {

  stepOne: FormGroup;
  stepFour: FormGroup;
  stepFive: FormGroup;
  stepFiveProductCat1: FormGroup;
  stepFiveProductCat2: FormGroup;

  haveBusinessName;
  haveBusinessDescription;
  category_list: any = [];
  business_photo_arr = [];
  designations = [];
  logoToUpload: File = null;
  ownerToUpload: File = null;
  
  step_one_data = {
    logo: '',
    business_name: '',
    business_description: '',
    business_photos: [],
  }

  step_four_data = {
    website_url: ''
  }

  step_five_data = {
    product_categories: [
      {
        id: null,
        app_master: this.route.snapshot.params['id'],
        category_name: 'Generic Category',
        description:''
      }
    ]
  }

  step_five_data_cat_1 = {
    products: [
      {
        id: null,
        app_master: this.route.snapshot.params['id'],
        product_category:'',
        product_name: '',
        price: '',
        discounted_price: '',
        packing_charges:'',
        tags: '',
      }
    ]
  }
  step_five_data_cat_2 = {
    products: [
      {
        id: null,
        app_master: this.route.snapshot.params['id'],
        product_category:'',
        product_name: '',
        price: '',
        discounted_price: '',
        packing_charges:'',
        tags: '',
      }
    ]
  }

  base_url: string;

  @ViewChild('stepper') stepper: MatStepper;

  isLinear = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private platformLocation: PlatformLocation
  ) { }

  ngOnInit() {

    this.base_url = (this.platformLocation as any).location.origin;
    this.stepOne = this._formBuilder.group({
      logo: [''],
      business_name: ['', Validators.required],
      business_description: [''],
      business_photos: [''],
    });

    this.stepFour = this._formBuilder.group({
      business_photos: [''],
      website_url: ['', Validators.required]
    });

    this.stepFive = this._formBuilder.group({
      product_categories: this._formBuilder.array([this.createProductCategory('Generic Category')]),
    });

    this.stepFiveProductCat1 = this._formBuilder.group({
      products: this._formBuilder.array([this.createProduct()]),
    });

    this.stepFiveProductCat2 = this._formBuilder.group({
      products: this._formBuilder.array([this.createProduct()]),
    });

    this.getAppDetails(this.route.snapshot.params['id']);
  }

  getAppDetails(id)
  {
    this.createAppService.getAppDetails(id).subscribe(
      data => {
        console.log(data);

        this.step_one_data.logo = data.logo;
        this.step_one_data.business_name = data.business_name;
        if(!this.step_one_data.business_name)
        {
        this.haveBusinessName=true;
        }
        

        this.step_one_data.business_description = data.business_description;

        if(!this.step_one_data.business_description)
        {
        this.haveBusinessDescription=true;
        }

        
        this.step_four_data.website_url = data.app_url;

        for(var i=0;i<data.app_imgs.length; i++)
        {
          var business_img_url = environment.urlEndpoint+data.app_imgs[i].app_img;
          this.step_one_data.business_photos.push(business_img_url)
        }
        
        if(data.app_product_categories.length>0)
        {
          this.step_five_data.product_categories = [];
          const category_control = <FormArray>this.stepFive.controls['product_categories'];
          
          for(var i=0; i<data.app_product_categories.length; i++)
          { 
            if(i<data.app_product_categories.length-1)
            {
            category_control.push(this.createProductCategory(''));
            }

            var prod_cat = {
                id: data.app_product_categories[i].id,
                app_master: id,
                category_name: data.app_product_categories[i].category_name,
                description:''
                
            }
            this.step_five_data.product_categories.push(prod_cat);


            if(i==0)
            {
              this.step_five_data_cat_1.products = [];
              const product_control_one = <FormArray>this.stepFiveProductCat1.controls['products'];
              if(data.app_product_categories[i].products.length>0)
              {
                for(var j=0; j<data.app_product_categories[i].products.length;j++)
                {
                  if(j<data.app_product_categories[i].products.length-1)
                  {
                    product_control_one.push(this.createProduct());
                  }
                  
                  var prod = {
                      id: data.app_product_categories[i].products[j].id,
                      app_master: this.route.snapshot.params['id'],
                      product_category:data.app_product_categories[i].id,
                      product_name: data.app_product_categories[i].products[j].product_name,
                      price: data.app_product_categories[i].products[j].price,
                      discounted_price: data.app_product_categories[i].products[j].discounted_price,
                      packing_charges:data.app_product_categories[i].products[j].packing_charges,
                      tags: data.app_product_categories[i].products[j].tags,
                    
                  }
                  this.step_five_data_cat_1.products.push(prod);
                }
                
              }
              else{
                this.step_five_data_cat_1 = {
                  products: [
                    {
                      id: null,
                      app_master: this.route.snapshot.params['id'],
                      product_category:data.app_product_categories[i].id,
                      product_name: '',
                      price: '',
                      discounted_price: '',
                      packing_charges:'',
                      tags: '',
                    }
                  ]
                }
              }
              
            }

            if(i==1)
            {
              this.step_five_data_cat_2.products = [];
              const product_control_two = <FormArray>this.stepFiveProductCat2.controls['products'];
              if(data.app_product_categories[i].products.length>0)
              {
                for(var j=0; j<data.app_product_categories[i].products.length;j++)
                {
                  if(j<data.app_product_categories[i].products.length-1)
                  {
                    product_control_two.push(this.createProduct());
                  }
                  
                  var prod = {
                      id: data.app_product_categories[i].products[j].id,
                      app_master: this.route.snapshot.params['id'],
                      product_category:data.app_product_categories[i].id,
                      product_name: data.app_product_categories[i].products[j].product_name,
                      price: data.app_product_categories[i].products[j].price,
                      discounted_price: data.app_product_categories[i].products[j].discounted_price,
                      packing_charges:data.app_product_categories[i].products[j].packing_charges,
                      tags: data.app_product_categories[i].products[j].tags,
                    
                  }
                  this.step_five_data_cat_2.products.push(prod);
                }
                
              }
              else{
                this.step_five_data_cat_2 = {
                  products: [
                    {
                      id: null,
                      app_master: this.route.snapshot.params['id'],
                      product_category:data.app_product_categories[i].id,
                      product_name: '',
                      price: '',
                      discounted_price: '',
                      packing_charges:'',
                      tags: '',
                    }
                  ]
                }
              }
              
            }
          }
        }

      },
      error => {

        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }
  submitCategory() {
    

    this.createAppService.editOrgProductCategory(this.route.snapshot.params['id'],this.step_five_data).subscribe(
      response => {
        console.log(response);
        const control = <FormArray>this.stepFive.controls['product_categories'];
        control.removeAt(1);
        const control1 = <FormArray>this.stepFiveProductCat1.controls['products'];
        control1.removeAt(1);
        const control2 = <FormArray>this.stepFiveProductCat2.controls['products'];
        control2.removeAt(1);

        
        this.getAppDetails(this.route.snapshot.params['id']);
        
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

  submitProduct(type: number) {
    if (type == 0) {
      var submitedData = this.step_five_data_cat_1;
    }
    if (type == 1) {
      var submitedData = this.step_five_data_cat_2;
    }

    this.createAppService.editOrgProduct(this.route.snapshot.params['id'],submitedData).subscribe(
      response => {
        console.log(response);

        const control = <FormArray>this.stepFive.controls['product_categories'];
        control.removeAt(1);

        if (type == 0) {
          const control1 = <FormArray>this.stepFiveProductCat1.controls['products'];
          control1.removeAt(1);
        }
        if (type == 1) {
          const control2 = <FormArray>this.stepFiveProductCat2.controls['products'];
          control2.removeAt(1);
        }
       
        this.getAppDetails(this.route.snapshot.params['id']);
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

  addProductCategory() {
    var product_cate = {
      id: null,
      app_master: this.route.snapshot.params['id'],
      category_name: '',
      description:''
    }
    

    const control = <FormArray>this.stepFive.controls['product_categories'];
    control.push(this.createProductCategory(''));
  }

  deleteProductCategory(index: number) {
    if (index > -1) {
      this.step_five_data.product_categories.splice(index, 1)
    }
    const control = <FormArray>this.stepFive.controls['product_categories'];
    control.removeAt(index);
  }

  createProductCategory(categoryName) {
    return this._formBuilder.group({
      category_name: [categoryName, Validators.required]
    });
  }

  geCategory(form) {
    return form.get('product_categories').controls
  }

  getProduct(form) {
    return form.get('products').controls
  }



  addProduct(type: number,product_cat_id) {
    
    var prod = {
      id:null,
      app_master: this.route.snapshot.params['id'],
      product_category:product_cat_id,
      product_name: '',
      price: '',
      discounted_price: '',
      packing_charges:'',
      tags: '',
    
    }

    if (type == 0) {
      this.step_five_data_cat_1.products.push(prod);
      const control = <FormArray>this.stepFiveProductCat1.controls['products'];
      control.push(this.createProduct());
    }
    if (type == 1) {
      this.step_five_data_cat_2.products.push(prod);
      const control = <FormArray>this.stepFiveProductCat2.controls['products'];
      control.push(this.createProduct());
    }
  }

  deleteProduct(index: number, type: number) {
    if (type == 0) {
      const control = <FormArray>this.stepFiveProductCat1.controls['products'];
      control.removeAt(index);
    }
    if (type == 1) {
      const control = <FormArray>this.stepFiveProductCat2.controls['products'];
      control.removeAt(index);
    }

  }

  createProduct() {
    return this._formBuilder.group({
      product_name: ['', Validators.required],
      price: ['', Validators.required],
      discounted_price: [''],
      packing_charges: [''],
      tags: [''],
    });
  }


  submitStepOne() {

    if (this.stepOne.valid) {

      this.createAppService.updateAppStepOne(this.route.snapshot.params['id'], this.logoToUpload, this.stepOne.value).subscribe(
        response => {

         
          this.toastr.success('Success', '', {
            timeOut: 3000,
          });

          for (let i = 0; i < this.business_photo_arr.length; i++) {
            this.createAppService.uploadOrgBusinessImages(this.route.snapshot.params['id'], this.business_photo_arr[i]).subscribe(
              response => {
               
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
      this.markFormGroupTouched(this.stepOne)
    }
  }

  submitStepFour() {
    if (this.stepFour.valid) {

      var data = {
        id: this.route.snapshot.params['id'],
        app_url: this.stepFour.value.website_url
      }
      this.createAppService.updateOrgAppURL(data).subscribe(
        response => {

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });

          this.btnClickNav('app-success')

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

  goToStep(value) {
    // this.storeCreateAppStep = parseInt(value) - 1;
    //localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  nextStep(value)
  {
    // this.storeCreateAppStep = parseInt(value) - 1;
    // localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  appLogoChange(logofile: FileList) {
    const reader = new FileReader();
    if (logofile && logofile.length) {
      const file = logofile.item(0);
      this.logoToUpload = file;
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.step_one_data.logo = event.target.result;
        // this.stepTwo.patchValue({
        //   logo: reader.result
        // });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  businessPhotoChange(event) {
    if(event.target.files.length>3)
    {
      this.toastr.error('You can not upload more than three business images', '', {
        timeOut: 3000,
      });
    }
    else{
      if (event.target.files && event.target.files.length) {
        for (let i = 0; i < event.target.files.length; i++) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.step_one_data.business_photos.push(event.target.result)
          }
          this.business_photo_arr.push(event.target.files[i]);
          reader.readAsDataURL(event.target.files[i]);
        }
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();

      }
    }
  }

  checkBusinessName() {

    if (this.step_one_data.business_name != null && this.step_one_data.business_name.length > 0) {
      this.haveBusinessName = true;
    }
    else {
      this.haveBusinessName = false;
    }
  }

  checkBusinessDescription() {

    if (this.step_one_data.business_description != null && this.step_one_data.business_description.length > 0) {
      this.haveBusinessDescription = true;
    }
    else {
      this.haveBusinessDescription = false;
    }
  }

  getSuggestedUrl(url: string) {
    return url.replace(/\s/g, "").toLowerCase();
  }

  getWebUrl(url: string) {
    this.step_four_data.website_url = url.replace(/\s/g, "").toLowerCase();
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

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

}
