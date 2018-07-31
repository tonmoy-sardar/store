import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { PlatformLocation } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('search') public searchElement: ElementRef;
  isLinear = true;
  haveBusinessName;
  haveBusinessDescription;
  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;
  stepFour: FormGroup;
  stepFive: FormGroup;
  stepFiveProductCat1: FormGroup;
  stepFiveProductCat2: FormGroup;
  stepSix: FormGroup;
  stepSeven: FormGroup;
  stepEight: FormGroup;
  category_list: any = [];
  business_photo_arr = [];
  designations = [];

  logoToUpload: File = null;
  ownerToUpload: File = null;

  storeCreateAppStep;

  logedUserId;
  logedUserGroup;

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
    owner_designation: '',
    store_address: '',
    lat: '',
    long: '',
    business_est_year: ''
  }

  setp_four_data = {
    website_url: ''
  }

  setp_five_data = {
    product_categories: [
      {
        id: null,
        app_master: localStorage.getItem('storeCreateAppID'),
        category_name: 'Generic',
        description: ''
      }
    ]
  }

  setp_five_data_cat_1 = {
    products: [
      {
        id: null,
        app_master: localStorage.getItem('storeCreateAppID'),
        product_category: '',
        product_name: '',
        price: '',
        discounted_price: '0.00',
        packing_charges: '0.00',
        tags: '',
      }
    ]
  }

  setp_five_data_cat_2 = {
    products: [
      {
        id: null,
        app_master: localStorage.getItem('storeCreateAppID'),
        product_category: '',
        product_name: '',
        price: '',
        discounted_price: '0.00',
        packing_charges: '0.00',
        tags: '',
      }
    ]
  }




  setp_six_data = {
    name:'',
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
    private platformLocation: PlatformLocation,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.storeCreateAppStep = 0;
    this.stepper.selectedIndex = 0;

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
      store_address: [''],
      lat: [''],
      long: [''],
      business_est_year: [''],
    });

    this.stepFour = this._formBuilder.group({
      business_photos: [''],
      website_url: ['', Validators.required]
    });

    this.stepFive = this._formBuilder.group({
      product_categories: this._formBuilder.array([this.createProductCategory('Generic')]),
    });

    this.stepFiveProductCat1 = this._formBuilder.group({
      products: this._formBuilder.array([this.createProduct()]),
    });

    this.stepFiveProductCat2 = this._formBuilder.group({
      products: this._formBuilder.array([this.createProduct()]),
    });


    this.stepSix = this._formBuilder.group({
      name: ['', Validators.required],
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
      //this.storeCreateAppStep = localStorage.getItem('storeCreateAppStep')
      //this.stepper.selectedIndex =  parseInt(this.storeCreateAppStep)
    }

    if (localStorage.getItem('storeCreateAppID')) {
      this.getTempAppDetails((localStorage.getItem('storeCreateAppID')));
    }

    // if (localStorage.getItem('storeSessionID')) {
    //   this.getTempUserDetails(localStorage.getItem('storeSessionID'));
    // }

    this.logedUserId = localStorage.getItem('logedUserUserId');
    this.logedUserGroup = localStorage.getItem('logedUserUserGroup').toLowerCase();
    this.getCategoryList();
    this.getDesignationDropdown();
    this.mapLoader();

  }


  mapLoader() {
    this.mapsAPILoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: ["address"] });

        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            console.log(place)
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            this.setp_three_data.store_address = place.formatted_address;
            this.setp_three_data.lat = lat.toString();
            this.setp_three_data.long = lng.toString();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
          });
        });
      }
    );
  }

  getDesignationDropdown() {
    this.createAppService.getDesignationDropdown().subscribe(
      (data: any[]) => {
        console.log(data);
        this.designations = data;
      },
      error => {
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

  submitCategory() {
    //console.log(this.setp_five_data);

    this.createAppService.createProductCategory(localStorage.getItem('storeCreateAppID'), this.setp_five_data).subscribe(
      response => {
        console.log(response);
        const control = <FormArray>this.stepFive.controls['product_categories'];
        control.removeAt(1);
        const control1 = <FormArray>this.stepFiveProductCat1.controls['products'];
        control1.removeAt(1);
        const control2 = <FormArray>this.stepFiveProductCat2.controls['products'];
        control2.removeAt(1);

        this.getTempAppDetails(localStorage.getItem('storeCreateAppID'));

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
      var submitedData = this.setp_five_data_cat_1;
    }
    if (type == 1) {
      var submitedData = this.setp_five_data_cat_2;
    }

    this.createAppService.createProduct(localStorage.getItem('storeCreateAppID'), submitedData).subscribe(
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
        this.getTempAppDetails(localStorage.getItem('storeCreateAppID'));

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
      app_master: localStorage.getItem('storeCreateAppID'),
      category_name: '',
      description: ''
    }
    this.setp_five_data.product_categories.push(product_cate)

    const control = <FormArray>this.stepFive.controls['product_categories'];
    control.push(this.createProductCategory(''));
  }

  deleteProductCategory(index: number) {
    if (index > -1) {
      this.setp_five_data.product_categories.splice(index, 1)
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



  addProduct(type: number, product_cat_id) {

    var prod = {
      id: null,
      app_master: localStorage.getItem('storeCreateAppID'),
      product_category: product_cat_id,
      product_name: '',
      price: '',
      discounted_price: '0.00',
      packing_charges: '0.00',
      tags: '',

    }

    if (type == 0) {
      this.setp_five_data_cat_1.products.push(prod);
      const control = <FormArray>this.stepFiveProductCat1.controls['products'];
      control.push(this.createProduct());
    }
    if (type == 1) {
      this.setp_five_data_cat_2.products.push(prod);
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
      discounted_price: ['0.00'],
      packing_charges: ['0.00'],
      tags: [''],
    });
  }

  checkBusinessName() {

    if (this.setp_two_data.business_name != null && this.setp_two_data.business_name.length > 0) {
      this.haveBusinessName = true;
    }
    else {
      this.haveBusinessName = false;
    }
  }

  checkBusinessDescription() {

    if (this.setp_two_data.business_description != null && this.setp_two_data.business_description.length > 0) {
      this.haveBusinessDescription = true;
    }
    else {
      this.haveBusinessDescription = false;
    }
  }

  // getTempUserDetails(id) {
  //   this.createAppService.getTempUserDetails(id).subscribe(
  //     (data: any[]) => {
  //       console.log(data);
  //       if (data.length > 0) {
  //         this.setp_three_data.owner_pic = data[0].owner_pic;
  //         this.setp_three_data.owner_name = data[0].owner_name;
  //         this.setp_three_data.owner_designation = data[0].owner_designation;
  //         this.setp_three_data.store_address = data[0].store_address;
  //         this.setp_three_data.lat = data[0].lat;
  //         this.setp_three_data.long = data[0].long;
  //         this.setp_three_data.business_est_year = data[0].business_est_year;
  //         this.user_id = data[0].id;
  //       }
  //     },
  //     error => {
  //       this.toastr.error('Something went wrong', '', {
  //         timeOut: 3000,
  //       });
  //     }
  //   );
  // };


  getTempAppDetails(id) {
    this.createAppService.getTempAppDetails(id).subscribe(
      (data: any[]) => {
        console.log(data);
        if (data.length > 0) {
          this.setp_one_data.app_category = data[0].app_category.id;
          this.stepOne.patchValue({
            app_category: data[0].app_category.id
          });

          this.setp_two_data.logo = data[0].appmaster.logo;
          this.setp_two_data.business_name = data[0].appmaster.business_name;
          if (!this.setp_two_data.business_name) {
            this.haveBusinessName = true;
          }


          this.setp_two_data.business_description = data[0].appmaster.business_description;

          if (!this.setp_two_data.business_description) {
            this.haveBusinessDescription = true;
          }


          this.setp_three_data.owner_pic = data[0].appmaster.owner_pic;
          this.setp_three_data.owner_name = data[0].appmaster.owner_name;
          this.setp_three_data.owner_designation = data[0].appmaster.owner_designation;
          this.setp_three_data.store_address = data[0].appmaster.store_address;
          this.setp_three_data.lat = data[0].appmaster.lat;
          this.setp_three_data.long = data[0].appmaster.long;
          this.setp_three_data.business_est_year = data[0].appmaster.business_est_year;


          this.setp_four_data.website_url = data[0].appmaster.app_url;
          this.setp_two_data.business_photos = [];
          for (var i = 0; i < data[0].app_imgs.length; i++) {
            var business_img_url = environment.urlEndpoint + data[0].app_imgs[i].app_img;
            this.setp_two_data.business_photos.push(business_img_url)
          }

          if (data[0].product_details.length > 0) {
            this.setp_five_data.product_categories = [];
            const category_control = <FormArray>this.stepFive.controls['product_categories'];

            for (var i = 0; i < data[0].product_details.length; i++) {
              if (i < data[0].product_details.length - 1) {
                category_control.push(this.createProductCategory(''));
              }

              var prod_cat = {
                id: data[0].product_details[i].id,
                app_master: id,
                category_name: data[0].product_details[i].category_name,
                description: ''

              }
              this.setp_five_data.product_categories.push(prod_cat);


              if (i == 0) {
                this.setp_five_data_cat_1.products = [];
                const product_control_one = <FormArray>this.stepFiveProductCat1.controls['products'];
                if (data[0].product_details[i].products.length > 0) {
                  for (var j = 0; j < data[0].product_details[i].products.length; j++) {
                    if (j < data[0].product_details[i].products.length - 1) {
                      product_control_one.push(this.createProduct());
                    }

                    var prod = {
                      id: data[0].product_details[i].products[j].id,
                      app_master: localStorage.getItem('storeCreateAppID'),
                      product_category: data[0].product_details[i].id,
                      product_name: data[0].product_details[i].products[j].product_name,
                      price: data[0].product_details[i].products[j].price,
                      discounted_price: data[0].product_details[i].products[j].discounted_price,
                      packing_charges: data[0].product_details[i].products[j].packing_charges,
                      tags: data[0].product_details[i].products[j].tags,

                    }
                    this.setp_five_data_cat_1.products.push(prod);
                  }

                }
                else {
                  this.setp_five_data_cat_1 = {
                    products: [
                      {
                        id: null,
                        app_master: localStorage.getItem('storeCreateAppID'),
                        product_category: data[0].product_details[i].id,
                        product_name: '',
                        price: '',
                        discounted_price: '0.00',
                        packing_charges: '0.00',
                        tags: '',
                      }
                    ]
                  }
                }

              }

              if (i == 1) {
                this.setp_five_data_cat_2.products = [];
                const product_control_two = <FormArray>this.stepFiveProductCat2.controls['products'];
                if (data[0].product_details[i].products.length > 0) {
                  for (var j = 0; j < data[0].product_details[i].products.length; j++) {
                    if (j < data[0].product_details[i].products.length - 1) {
                      product_control_two.push(this.createProduct());
                    }

                    var prod = {
                      id: data[0].product_details[i].products[j].id,
                      app_master: localStorage.getItem('storeCreateAppID'),
                      product_category: data[0].product_details[i].id,
                      product_name: data[0].product_details[i].products[j].product_name,
                      price: data[0].product_details[i].products[j].price,
                      discounted_price: data[0].product_details[i].products[j].discounted_price,
                      packing_charges: data[0].product_details[i].products[j].packing_charges,
                      tags: data[0].product_details[i].products[j].tags,

                    }
                    this.setp_five_data_cat_2.products.push(prod);
                  }

                }
                else {
                  this.setp_five_data_cat_2 = {
                    products: [
                      {
                        id: null,
                        app_master: localStorage.getItem('storeCreateAppID'),
                        product_category: data[0].product_details[i].id,
                        product_name: '',
                        price: '',
                        discounted_price: '0.00',
                        packing_charges: '0.00',
                        tags: '',
                      }
                    ]
                  }
                }

              }
            }
          }




        }

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
    console.log(this.setp_two_data.business_photos.length)
    if (event.target.files && event.target.files.length) {
      var max_size = Math.round(event.target.files.length + this.setp_two_data.business_photos.length)
      if (max_size < 4) {
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
      else {
        this.toastr.error('You can upload maximum 3 business photos', '', {
          timeOut: 3000,
        });
      }


    }
  }

  categorySelect(id) {
    this.setp_one_data.app_category = id
    this.stepOne.patchValue({
      app_category: id
    });
  }

  getSuggestedUrl(url: string) {
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
            this.stepper.next();
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
            this.stepper.next();

            this.setp_five_data = {
              product_categories: [
                {
                  id: null,
                  app_master: response.id,
                  category_name: 'Generic',
                  description: ''
                }
              ]
            }
          
            this.setp_five_data_cat_1 = {
              products: [
                {
                  id: null,
                  app_master: response.id,
                  product_category: '',
                  product_name: '',
                  price: '',
                  discounted_price: '0.00',
                  packing_charges: '0.00',
                  tags: '',
                }
              ]
            }
          
            this.setp_five_data_cat_2 = {
              products: [
                {
                  id: null,
                  app_master: response.id,
                  product_category: '',
                  product_name: '',
                  price: '',
                  discounted_price: '0.00',
                  packing_charges: '0.00',
                  tags: '',
                }
              ]
            }
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
          if (this.business_photo_arr.length > 0) {
            for (let i = 0; i < this.business_photo_arr.length; i++) {
              this.createAppService.uploadBusinessImages(localStorage.getItem('storeCreateAppID'), this.business_photo_arr[i]).subscribe(
                response => {

                },
                error => {
                  this.toastr.error('Something went wrong', '', {
                    timeOut: 3000,
                  });
                }
              );
              if (i == this.business_photo_arr.length - 1) {
                this.toastr.success('Success', '', {
                  timeOut: 3000,
                });
                this.stepper.next();
              }
            }
          }
          else {
            this.toastr.success('Success', '', {
              timeOut: 3000,
            });
            this.stepper.next();
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
      console.log(this.stepThree.value)
      this.createAppService.submitOwnerInfo(localStorage.getItem('storeCreateAppID'),localStorage.getItem('storeSessionID'), this.ownerToUpload, this.stepThree.value).subscribe(
        response => {
          //this.user_id = response.id;
          this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
          localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });
          this.stepper.next();
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
    //localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  nextStep(value) {
    this.storeCreateAppStep = parseInt(value) - 1;
    localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
    this.stepper.next();
  }

  submitStepFour() {
    if (this.stepFour.valid) {

      var data = {
        id: localStorage.getItem('storeCreateAppID'),
        app_url: this.stepFour.value.website_url
      }
      this.createAppService.updateTempAppURL(data).subscribe(
        response => {
          this.toastr.success('Success', '', {
            timeOut: 3000,
          });
          this.stepper.next();
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

  submitStepSix() {
    if (this.stepSix.valid) {
      let data = {
        name: this.stepSix.value.name,
        email_id: this.stepSix.value.email_id,
        contact_no: this.stepSix.value.contact_no
      }
      this.createAppService.createOriginalApp(localStorage.getItem('storeCreateAppID'),data).subscribe(
        response => {
          // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
          // localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);

          localStorage.removeItem('storeCreateAppID');
          localStorage.removeItem('storeCreateAppStep');
          localStorage.removeItem('storeSessionID');

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });
          this.stepper.next();
          this.btnClickNav('payment')

        },
        error => {
          
          this.toastr.error(error.error.msg, '', {
            timeOut: 3000,
          });
        }
      );

    }
    else {
      this.markFormGroupTouched(this.stepSix)
    }
  }

  submitStepSixWithLogin() {
    
    let data = {
     user_id:this.logedUserId
    }
      this.createAppService.createOriginalAppWithLogin(localStorage.getItem('storeCreateAppID'),data).subscribe(
        response => {
          // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
          // localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);

          localStorage.removeItem('storeCreateAppID');
          localStorage.removeItem('storeCreateAppStep');
          localStorage.removeItem('storeSessionID');

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });
          this.stepper.next();
          this.btnClickNav('payment')

        },
        error => {
          
          this.toastr.error(error.error.msg, '', {
            timeOut: 3000,
          });
        }
      );

  }


  submitStepSixFranchise() {
    if (this.stepSix.valid) {
      let data = {
        user_id:this.logedUserId,
        name: this.stepSix.value.name,
        email_id: this.stepSix.value.email_id,
        contact_no: this.stepSix.value.contact_no
      }
      this.createAppService.createOriginalAppByFranchise(localStorage.getItem('storeCreateAppID'),data).subscribe(
        response => {
          // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
          // localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);

          localStorage.removeItem('storeCreateAppID');
          localStorage.removeItem('storeCreateAppStep');
          localStorage.removeItem('storeSessionID');

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });
          this.stepper.next();
          this.btnClickNav('payment')

        },
        error => {
          
          this.toastr.error(error.error.msg, '', {
            timeOut: 3000,
          });
        }
      );

    }
    else {
      this.markFormGroupTouched(this.stepSix)
    }
  }

  




}
