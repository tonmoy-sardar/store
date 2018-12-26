import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { PlatformLocation } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialogComponent } from "../../core/component/confirm-dialog/confirm-dialog.component";
import { OtpDialogComponent } from "../../core/component/otp-dialog/otp-dialog.component";
import { LoginComponent } from '../../core/component/login/login.component';
import { LoadingState } from '../../core/component/loading/loading.component';
import { forkJoin } from "rxjs/observable/forkJoin";
import { SeoserviceService } from '../../core/services/seoservice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit {
  isLoggedin: boolean;
  user_name: string;
  user_group: string = '';
  loading: LoadingState = LoadingState.NotReady;
  now: Date = new Date();
  currentDate;
  sessionID;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('search') public searchElement: ElementRef;
  isLinear = true;
  haveBusinessName = false;
  haveBusinessDescription = false;
  haveBusinessLogo = false;
  haveBusinessImage = false;
  haveOwnerName = false;
  haveOwnerDesignation = false;
  haveBusinessEstYear = false;
  haveBusinessLocation = false;
  haveOwnerPic = false;
  haveName = false;
  haveContactNo = false;
  haveEmailAddress = false;
  havePassword: boolean = false;
  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;
  stepFour: FormGroup;
  stepFive: FormGroup;
  stepFiveDataCatProd: FormGroup;
  stepSix: FormGroup;
  stepSeven: FormGroup;
  stepEight: FormGroup;
  category_list: any = [];
  business_photo_arr = [];
  designations = [];

  logoToUpload: File = null;
  ownerToUpload: File = null;

  storeCreateAppStep;

  serviceType = 1;

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
    is_product_service: 0,
    is_only_display: false,
    is_only_display_key: false
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
        app_master: sessionStorage.getItem('storeCreateAppID'),
        category_name: 'Generic',
        description: ''
      }
    ]
  }

  setp_five_data_cat_prod = [
    {
      products: [
        {
          id: null,
          app_master: sessionStorage.getItem('storeCreateAppID'),
          product_category: '',
          product_name: '',
          price: '0.00',
          discounted_price: '0.00',
          packing_charges: '0.00',
          tags: '',
        }
      ]
    }
  ]
  category_confirm_key: boolean;

  user_app_details: any;

  setp_six_data = {
    name: '',
    contact_no: '',
    email_id: '',
    password: ''
  }

  base_url: string;
  logedUserFullName;
  logedUserContactNo;
  logedUserEmail;
  haveBusinessType: boolean = false;
  business_type: any = [
    {
      name: "Product",
      value: 1
    },
    {
      name: "Service",
      value: 2
    }
  ]
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private platformLocation: PlatformLocation,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private _seoService: SeoserviceService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      console.log(data);
      this._seoService.updateTitle(data['title']);
      this._seoService.updateDescription(data['description'])
      this._seoService.updateKeywords(data['keywords'])
    });
    
    this.sessionID = sessionStorage.getItem('storeSessionID');
    if (!this.sessionID) {
      this.currentDate = this.now.getTime();
      this.sessionID = this.currentDate.toString() + Math.floor((Math.random() * 1000000000) + 1);
      sessionStorage.setItem('storeSessionID', this.sessionID);
    }
    if (sessionStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = sessionStorage.getItem('logedUserFullName');
      this.logedUserEmail = sessionStorage.getItem('logedUserEmail');

      this.logedUserFullName = sessionStorage.getItem('logedUserFullName');

      this.logedUserContactNo = sessionStorage.getItem('logedUserContactNo');

      if (sessionStorage.getItem('logedUserUserGroup')) {
        this.user_group = sessionStorage.getItem('logedUserUserGroup')
      }
    }

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
      is_product_service: [null],
      is_only_display: [false]
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

    this.stepFiveDataCatProd = this._formBuilder.group({
      product_cols: this._formBuilder.array([this.createProductCols()]),
    })


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
      password: ['', Validators.required]
    });

    this.stepOne.patchValue({
      session_id: sessionStorage.getItem('storeSessionID')
    });

    this.setp_one_data.session_id = sessionStorage.getItem('storeSessionID');

    if (sessionStorage.getItem('storeCreateAppStep')) {
      //alert(sessionStorage.getItem('storeCreateAppStep'));
      //this.storeCreateAppStep = sessionStorage.getItem('storeCreateAppStep')
      //this.stepper.selectedIndex =  parseInt(this.storeCreateAppStep)
    }

    if (sessionStorage.getItem('storeCreateAppID')) {
      this.getTempAppDetails((sessionStorage.getItem('storeCreateAppID')));
    }

    // if (sessionStorage.getItem('storeSessionID')) {
    //   this.getTempUserDetails(sessionStorage.getItem('storeSessionID'));
    // }

    this.logedUserId = sessionStorage.getItem('logedUserUserId');
    this.logedUserGroup = sessionStorage.getItem('logedUserUserGroup');
    this.getCategoryList();
    this.getDesignationDropdown();
    this.mapLoader();

  }

  businessTypeChange(e) {
    if (e.value) {
      this.haveBusinessType = true;
      if (e.value == 1) {
        this.setp_two_data.is_only_display_key = true;
      }
      else {
        this.setp_two_data.is_only_display_key = false;
        this.setp_two_data.is_only_display = false;
      }
    }
  }



  openLogin() {
    this.dialog.open(
      LoginComponent, {
        width: '480px', panelClass: 'popup_wrapper', disableClose: true
      }
    );
  }

  logout() {
    this.isLoggedin = false;
    sessionStorage.clear();
    this.router.navigate(['/home']);
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
            this.haveBusinessLocation = true;
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

  updateAppMasterIsProductService() {
    var data = {
      is_product_service: this.serviceType
    }
    this.createAppService.updateAppMasterIsProductService(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
      response => {

      },
      error => {

      }
    );
  }
  submitCategory() {

    this.updateAppMasterIsProductService();

    if (this.stepFive.valid) {
      this.loading = LoadingState.Processing;
      console.log(this.setp_five_data);
      this.createAppService.createProductCategory(sessionStorage.getItem('storeCreateAppID'), this.setp_five_data).subscribe(
        response => {
          console.log(response);
          this.loading = LoadingState.Ready;
          const product_categories_control = <FormArray>this.stepFive.controls['product_categories'];
          for (var i = this.setp_five_data.product_categories.length - 1; i > 0; i--) {
            product_categories_control.removeAt(i);
          }
          const product_cols_control = <FormArray>this.stepFiveDataCatProd.controls['product_cols'];

          for (var j = this.setp_five_data_cat_prod.length - 1; j >= 0; j--) {
            const product_rows_control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(j).get('products') as FormArray;
            for (var k = this.setp_five_data_cat_prod[j].products.length - 1; k > 0; k--) {
              product_rows_control.removeAt(k);
            }
            if (j > 0) {
              product_cols_control.removeAt(j);
            }
          }

          this.getTempAppDetails(sessionStorage.getItem('storeCreateAppID'));

          this.toastr.success('Success', '', {
            timeOut: 3000,
          });

        },
        error => {
          this.loading = LoadingState.Ready;
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

  submitProduct() {

    this.updateAppMasterIsProductService();
    var i = 0;
    var forkArray = []
    this.setp_five_data_cat_prod.forEach(x => {
      var data = {
        products: []
      };
      if (this.serviceType == 1) {
        x.products.forEach(y => {
          if (y.product_name != "" && y.price != "") {
            data.products.push(y)
          }
          else {

          }
        })
      }
      else if (this.serviceType == 2) {
        x.products.forEach(y => {
          if (y.product_name != "") {
            data.products.push(y)
          }
          else {

          }
        })
      }

      if (data.products.length > 0) {
        this.loading = LoadingState.Processing;
        forkArray.push(this.createAppService.createProduct(sessionStorage.getItem('storeCreateAppID'), data))
      }
      i++;
    })
    if (i == this.setp_five_data_cat_prod.length) {
      forkJoin(forkArray).subscribe(results => {
        this.toastr.success('Success', '', {
          timeOut: 3000,
        });
        const product_categories_control = <FormArray>this.stepFive.controls['product_categories'];
        for (var i = this.setp_five_data.product_categories.length - 1; i > 0; i--) {
          product_categories_control.removeAt(i);
        }
        const product_cols_control = <FormArray>this.stepFiveDataCatProd.controls['product_cols'];
        for (var j = this.setp_five_data_cat_prod.length - 1; j >= 0; j--) {
          const product_rows_control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(j).get('products') as FormArray;
          for (var k = this.setp_five_data_cat_prod[j].products.length - 1; k > 0; k--) {
            product_rows_control.removeAt(k);
          }
          if (j > 0) {
            product_cols_control.removeAt(j);
          }

        }
        this.loading = LoadingState.Ready;
        this.category_confirm_key = false;
        this.getTempAppDetails(sessionStorage.getItem('storeCreateAppID'));
      },
        error => {
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );
    }


  }


  addProductCategory() {
    var product_cate = {
      id: null,
      app_master: sessionStorage.getItem('storeCreateAppID'),
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
    const product_cols_control = <FormArray>this.stepFiveDataCatProd.controls['product_cols'];

    for (var i = this.setp_five_data_cat_prod.length - 1; i >= 0; i--) {
      if (i == index) {
        const product_rows_control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(i).get('products') as FormArray;
        for (var k = this.setp_five_data_cat_prod[i].products.length - 1; k > 0; k--) {
          product_rows_control.removeAt(k);
        }
        this.setp_five_data_cat_prod.splice(index, 1)
        if (i > 0) {
          product_cols_control.removeAt(i);
        }
      }
    }
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




  addProduct(i: number, product_cat_id) {
    var prod = {
      id: null,
      app_master: sessionStorage.getItem('storeCreateAppID'),
      product_category: product_cat_id,
      product_name: '',
      price: '0.00',
      discounted_price: '0.00',
      packing_charges: '0.00',
      tags: '',
    }
    const control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(i).get('products') as FormArray;
    control.push(this.createProduct());
    this.setp_five_data_cat_prod[i].products.push(prod)
  }

  deleteProduct(i: number, j: number) {
    const control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(i).get('products') as FormArray;
    control.removeAt(j);
    this.setp_five_data_cat_prod[i].products.splice(j, 1)

  }

  createProductCols() {
    return this._formBuilder.group({
      products: this._formBuilder.array([this.createProduct()]),
    });
  }

  createProduct() {
    return this._formBuilder.group({
      product_name: ['', Validators.required],
      price: ['0.00', Validators.required],
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

  checkOwnerName() {
    if (this.setp_three_data.owner_name != null && this.setp_three_data.owner_name.length > 0) {
      this.haveOwnerName = true;
    }
    else {
      this.haveOwnerName = false;
    }
  }

  checkBusinessEstYear() {
    if (this.setp_three_data.business_est_year != null && this.setp_three_data.business_est_year.length > 0) {
      this.haveBusinessEstYear = true;
    }
    else {
      this.haveBusinessEstYear = false;
    }
  }

  checkOwnerDesignation() {
    if (this.setp_three_data.owner_designation) {
      this.haveOwnerDesignation = true;
    }
    else {
      this.haveOwnerDesignation = false;
    }
  }

  checkName() {
    if (this.setp_six_data.name != null && this.setp_six_data.name.length > 0) {
      this.haveName = true;
    }
    else {
      this.haveName = false;
    }
  }

  checkContactNo() {
    if (this.setp_six_data.contact_no != null && this.setp_six_data.contact_no.length > 0) {
      this.haveContactNo = true;
    }
    else {
      this.haveContactNo = false;
    }
  }
  checkEmailAddress() {
    if (this.setp_six_data.email_id != null && this.setp_six_data.email_id.length > 0) {
      this.haveEmailAddress = true;
    }
    else {
      this.haveEmailAddress = false;
    }
  }

  checkPassword() {
    if (this.setp_six_data.password != null && this.setp_six_data.password.length > 0) {
      this.havePassword = true;
    }
    else {
      this.havePassword = false;
    }
  }




  getTempAppDetails(id) {
    this.createAppService.getTempAppDetails(id).subscribe(
      (data: any[]) => {
        console.log(data);
        this.user_app_details = data;
        if (data.length > 0) {
          this.setp_one_data.app_category = data[0].app_category.id;
          this.stepOne.patchValue({
            app_category: data[0].app_category.id
          });
          if (data[0].is_product_service) {
            this.serviceType = data[0].is_product_service;

          }
          else {
            this.serviceType = 1;
          }
          this.setp_two_data.logo = data[0].appmaster.logo;

          this.setp_two_data.is_product_service = data[0].appmaster.is_product_service;
          if (data[0].appmaster.is_product_service == 1) {
            this.setp_two_data.is_only_display_key = true;
          }
          this.setp_two_data.is_only_display = data[0].appmaster.is_only_display;
          if (data[0].appmaster.is_product_service) {
            this.haveBusinessType = true;
          }

          if (this.setp_two_data.logo) {
            this.haveBusinessLogo = true
          }
          this.setp_two_data.business_name = data[0].appmaster.business_name;
          if (this.setp_two_data.business_name) {
            this.haveBusinessName = true;
          }


          this.setp_two_data.business_description = data[0].appmaster.business_description;

          if (this.setp_two_data.business_description) {
            this.haveBusinessDescription = true;
          }


          this.setp_three_data.owner_pic = data[0].appmaster.owner_pic;
          if (this.setp_three_data.owner_pic) {
            this.haveOwnerPic = true;
          }

          this.setp_three_data.owner_name = data[0].appmaster.owner_name;
          if (this.setp_three_data.owner_name) {
            this.haveOwnerName = true;
          }

          this.setp_three_data.owner_designation = data[0].appmaster.owner_designation;
          if (this.setp_three_data.owner_designation) {
            this.haveOwnerDesignation = true;
          }

          this.setp_three_data.store_address = data[0].appmaster.store_address;
          this.setp_three_data.lat = data[0].appmaster.lat;
          this.setp_three_data.long = data[0].appmaster.long;
          if (this.setp_three_data.store_address && this.setp_three_data.lat && this.setp_three_data.long) {
            this.haveBusinessLocation = true;
          }

          this.setp_three_data.business_est_year = data[0].appmaster.business_est_year;
          if (this.setp_three_data.business_est_year) {
            this.haveBusinessEstYear = true;
          }

          this.setp_four_data.website_url = data[0].appmaster.app_url;
          this.setp_two_data.business_photos = [];
          for (var i = 0; i < data[0].app_imgs.length; i++) {
            var business_img_url = environment.urlEndpoint + data[0].app_imgs[i].app_img;
            this.setp_two_data.business_photos.push(business_img_url)
            this.haveBusinessImage = true;
          }

          if (data[0].product_details.length > 0) {
            this.setp_five_data.product_categories = [];
            this.setp_five_data_cat_prod = [];

            const category_control = <FormArray>this.stepFive.controls['product_categories'];
            const product_cols_control = <FormArray>this.stepFiveDataCatProd.controls['product_cols'];
            for (var i = 0; i < data[0].product_details.length; i++) {
              if (i < data[0].product_details.length - 1) {
                category_control.push(this.createProductCategory(''));
                product_cols_control.push(this.createProductCols());
              }

              var prod_cat = {
                id: data[0].product_details[i].id,
                app_master: id,
                category_name: data[0].product_details[i].category_name,
                description: ''

              }
              this.setp_five_data.product_categories.push(prod_cat);

              var catProdData = {
                products: [
                  {
                    id: null,
                    app_master: sessionStorage.getItem('storeCreateAppID'),
                    product_category: data[0].product_details[i].id,
                    product_name: '',
                    price: '0.00',
                    discounted_price: '0.00',
                    packing_charges: '0.00',
                    tags: '',
                  }
                ]
              }

              this.setp_five_data_cat_prod.push(catProdData);
              if (data[0].product_details[i].products.length > 0) {
                const product_rows_control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(i).get('products') as FormArray;
                console.log(data[0].product_details[i].products.length)
                for (var j = 0; j < data[0].product_details[i].products.length; j++) {
                  var prod = {
                    id: data[0].product_details[i].products[j].id,
                    app_master: sessionStorage.getItem('storeCreateAppID'),
                    product_category: data[0].product_details[i].id,
                    product_name: data[0].product_details[i].products[j].product_name,
                    price: data[0].product_details[i].products[j].price,
                    discounted_price: data[0].product_details[i].products[j].discounted_price,
                    packing_charges: data[0].product_details[i].products[j].packing_charges,
                    tags: data[0].product_details[i].products[j].tags
                  }

                  if (j == 0) {
                    this.setp_five_data_cat_prod[i].products.splice(j, 1)
                  }
                  this.setp_five_data_cat_prod[i].products.splice(j, 0, prod);
                  if (j < data[0].product_details[i].products.length - 1) {
                    product_rows_control.push(this.createProduct());
                  }

                }
              }
              this.category_confirm_key = true;

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
  };

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  getCategoryList() {
    this.createAppService.getCategoryList().subscribe(
      res => {
        this.category_list = res;
        this.loading = LoadingState.Ready;
      },
      error => {
        this.loading = LoadingState.Processing;
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
        this.haveBusinessLogo = true;
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
        this.haveOwnerPic = true;
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
        this.haveBusinessImage = true;
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
      this.loading = LoadingState.Processing;

      if (sessionStorage.getItem('storeSessionID') && sessionStorage.getItem('storeCreateAppID')) {
        this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
        sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        let data = {
          app_category: this.stepOne.value.app_category
        }

        this.createAppService.editCategoryMaping(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
          response => {
            this.loading = LoadingState.Ready;
            // this.toastr.success('Success', '', {
            //   timeOut: 3000,
            // });
            this.stepper.next();
          },
          error => {
            this.loading = LoadingState.Ready;
            this.toastr.error('Something went wrong', '', {
              timeOut: 3000,
            });
          }
        );
      }
      else {
        this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
        sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        let data = {
          session_id: this.stepOne.value.session_id,
          app_category: this.stepOne.value.app_category
        }

        this.createAppService.createTempApp(data).subscribe(
          response => {
            console.log(response);
            this.loading = LoadingState.Ready;
            sessionStorage.setItem('storeCreateAppID', response.id);
            // this.toastr.success('Success', '', {
            //   timeOut: 3000,
            // });
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

          },
          error => {
            this.loading = LoadingState.Ready;
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
      this.loading = LoadingState.Processing;
      this.createAppService.logoUploadSection(sessionStorage.getItem('storeCreateAppID'), this.logoToUpload, this.stepTwo.value).subscribe(
        response => {

          this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
          sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
          if (this.business_photo_arr.length > 0) {
            for (let i = 0; i < this.business_photo_arr.length; i++) {
              this.createAppService.uploadBusinessImages(sessionStorage.getItem('storeCreateAppID'), this.business_photo_arr[i]).subscribe(
                response => {

                },
                error => {
                  this.loading = LoadingState.Ready;
                  this.toastr.error('Something went wrong', '', {
                    timeOut: 3000,
                  });
                }
              );
              if (i == this.business_photo_arr.length - 1) {
                // this.toastr.success('Success', '', {
                //   timeOut: 3000,
                // });
                this.loading = LoadingState.Ready;
                this.stepper.next();
              }
            }
          }
          else {
            this.loading = LoadingState.Ready;
            // this.toastr.success('Success', '', {
            //   timeOut: 3000,
            // });
            this.stepper.next();
          }

        },
        error => {
          this.loading = LoadingState.Ready;
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
      // console.log(this.stepThree.value)
      this.loading = LoadingState.Processing;
      this.createAppService.submitOwnerInfo(sessionStorage.getItem('storeCreateAppID'), sessionStorage.getItem('storeSessionID'), this.ownerToUpload, this.stepThree.value).subscribe(
        response => {
          //this.user_id = response.id;
          this.storeCreateAppStep = parseInt(this.storeCreateAppStep) + 1;
          sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
          this.loading = LoadingState.Ready;
          // this.toastr.success('Success', '', {
          //   timeOut: 3000,
          // });
          this.stepper.next();
        },
        error => {
          this.loading = LoadingState.Ready;
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
    //sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  nextStep(value) {
    this.storeCreateAppStep = parseInt(value) - 1;
    sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
    this.stepper.next();
  }

  save_nextStep(value) {
    var keepCatGoing = true;
    var keepProdGoing = true;
    if (this.user_app_details[0].product_details.length != this.setp_five_data.product_categories.length) {
      this.setp_five_data.product_categories.forEach(x => {
        if (x.category_name != "" && keepCatGoing) {
          this.toastr.error('Please confirm category', '', {
            timeOut: 3000,
          });
          keepCatGoing = false;
        }
      })
    }
    for (var i = 0; i < this.setp_five_data_cat_prod.length; i++) {
      var d = this.setp_five_data_cat_prod[i];
      var k = this.user_app_details[0].product_details[i]
      if (d.products.length != k.products.length) {
        d.products.forEach(y => {
          if (y.product_name != "" && y.price != "" && keepProdGoing) {
            this.toastr.error('Please confirm product', '', {
              timeOut: 3000,
            });
            keepProdGoing = false;
          }
        })
      }
    }
    if (keepCatGoing && keepProdGoing) {
      this.storeCreateAppStep = parseInt(value) - 1;
      sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
      this.stepper.next();
    }

  }

  submitStepFour() {
    if (this.stepFour.valid) {
      this.loading = LoadingState.Processing;
      var data = {
        id: sessionStorage.getItem('storeCreateAppID'),
        app_url: this.stepFour.value.website_url
      }
      this.createAppService.updateTempAppURL(data).subscribe(
        response => {
          this.loading = LoadingState.Ready;
          // this.toastr.success('Success', '', {
          //   timeOut: 3000,
          // });
          this.stepper.next();
        },
        error => {
          this.loading = LoadingState.Ready;
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

  submitStepSixOld() {
    if (this.stepSix.valid) {
      this.loading = LoadingState.Processing;
      let data = {
        name: this.stepSix.value.name,
        email_id: this.stepSix.value.email_id,
        contact_no: this.stepSix.value.contact_no,
        password: this.stepSix.value.password
      }
      this.createAppService.createOriginalApp(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
        response => {
          // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
          // sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
          // var app_id = sessionStorage.getItem('storeCreateAppID');
          sessionStorage.removeItem('storeCreateAppID');
          sessionStorage.removeItem('storeCreateAppStep');
          sessionStorage.removeItem('storeSessionID');
          this.loading = LoadingState.Ready;
          // this.toastr.success('Success', '', {
          //   timeOut: 3000,
          // });
          console.log(response)
          // this.openOtpDialog(response['otp'], response['user_id'], response['app_master_id'])

        },
        error => {
          this.loading = LoadingState.Ready;
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

  submitStepSix() {
    if (this.stepSix.valid) {
      this.loading = LoadingState.Processing;
      var user_id = '';
      let data = {
        user_id: user_id,
        email_id: this.stepSix.value.email_id,
        contact_no: this.stepSix.value.contact_no,
        password: this.stepSix.value.password
      }
      this.createAppService.sendAppCreateOtp(data).subscribe(
        response => {


          this.loading = LoadingState.Ready;

          console.log(response)
          this.openOtpDialog(response['otp'], user_id, this.stepSix.value.contact_no, this.stepSix.value.email_id, 'normalUser')

        },
        error => {
          this.loading = LoadingState.Ready;
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


  createOriginalApp() {
    this.loading = LoadingState.Processing;
    let data = {
      name: this.stepSix.value.name,
      email_id: this.stepSix.value.email_id,
      contact_no: this.stepSix.value.contact_no,
      password: this.stepSix.value.password
    }
    this.createAppService.createOriginalApp(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
      response => {

        sessionStorage.removeItem('storeCreateAppID');
        sessionStorage.removeItem('storeCreateAppStep');
        sessionStorage.removeItem('storeSessionID');
        this.loading = LoadingState.Ready;

        this.btnClickNav('payment/' + response['app_master_id'])

      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error(error.error.msg, '', {
          timeOut: 3000,
        });
      }
    );
  }

  submitStepSixWithLogin() {
    this.loading = LoadingState.Processing;
    let data = {
      user_id: this.logedUserId
    }
    this.createAppService.createOriginalAppWithLogin(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
      response => {
        // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
        // sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
        // var app_id = sessionStorage.getItem('storeCreateAppID');
        sessionStorage.removeItem('storeCreateAppID');
        sessionStorage.removeItem('storeCreateAppStep');
        sessionStorage.removeItem('storeSessionID');
        this.loading = LoadingState.Ready;
        // this.toastr.success('Success', '', {
        //   timeOut: 3000,
        // });
        this.btnClickNav('payment/' + response['app_master_id'])

      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error(error.error.msg, '', {
          timeOut: 3000,
        });
      }
    );

  }


  submitStepSixFranchiseOld() {
    if (this.stepSix.valid) {
      this.loading = LoadingState.Processing;
      let data = {
        user_id: this.logedUserId,
        name: this.stepSix.value.name,
        email_id: this.stepSix.value.email_id,
        contact_no: this.stepSix.value.contact_no,
        password: this.stepSix.value.password
      }
      this.createAppService.createOriginalAppByFranchise(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
        response => {
          // this.storeCreateAppStep = (this.storeCreateAppStep) + 1;
          // sessionStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
          // var app_id = sessionStorage.getItem('storeCreateAppID');
          sessionStorage.removeItem('storeCreateAppID');
          sessionStorage.removeItem('storeCreateAppStep');
          sessionStorage.removeItem('storeSessionID');
          this.loading = LoadingState.Ready;
          // this.toastr.success('Success', '', {
          //   timeOut: 3000,
          // });
          //this.openOtpDialog(response['otp'], response['user_id'], response['app_master_id'])

        },
        error => {
          // console.log(error)
          this.loading = LoadingState.Ready;
          let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: { msg: error.error.msg }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              let data = {
                name: this.stepSix.value.name,
                email_id: this.stepSix.value.email_id,
                contact_no: this.stepSix.value.contact_no
              }
              this.createAppService.createAppStepLastForFranchiseExist(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
                response => {
                  console.log(response)
                  // var app_id = sessionStorage.getItem('storeCreateAppID');
                  sessionStorage.removeItem('storeCreateAppID');
                  sessionStorage.removeItem('storeCreateAppStep');
                  sessionStorage.removeItem('storeSessionID');
                  this.loading = LoadingState.Ready;
                  // this.toastr.success('Success', '', {
                  //   timeOut: 3000,
                  // });
                  this.btnClickNav('payment/' + response['app_master_id'])
                },
                error => {
                  this.loading = LoadingState.Ready;
                  this.toastr.error(error.error.msg, '', {
                    timeOut: 3000,
                  });
                }
              )
            }
          });
        }
      );

    }
    else {
      this.markFormGroupTouched(this.stepSix)
    }
  }


  createOriginalAppByFranchise() {
    this.loading = LoadingState.Processing;
    let data = {
      user_id: this.logedUserId,
      name: this.stepSix.value.name,
      email_id: this.stepSix.value.email_id,
      contact_no: this.stepSix.value.contact_no,
      password: this.stepSix.value.password
    }
    this.createAppService.createOriginalAppByFranchise(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
      response => {

        sessionStorage.removeItem('storeCreateAppID');
        sessionStorage.removeItem('storeCreateAppStep');
        sessionStorage.removeItem('storeSessionID');
        this.loading = LoadingState.Ready;

        this.btnClickNav('payment/' + response['app_master_id'])
      },
      error => {
        // console.log(error)
        this.loading = LoadingState.Ready;
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: { msg: error.error.msg }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            let data = {
              name: this.stepSix.value.name,
              email_id: this.stepSix.value.email_id,
              contact_no: this.stepSix.value.contact_no
            }
            this.createAppService.createAppStepLastForFranchiseExist(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
              response => {
                console.log(response)
                // var app_id = sessionStorage.getItem('storeCreateAppID');
                sessionStorage.removeItem('storeCreateAppID');
                sessionStorage.removeItem('storeCreateAppStep');
                sessionStorage.removeItem('storeSessionID');
                this.loading = LoadingState.Ready;
                // this.toastr.success('Success', '', {
                //   timeOut: 3000,
                // });
                this.btnClickNav('payment/' + response['app_master_id'])
              },
              error => {
                this.loading = LoadingState.Ready;
                this.toastr.error(error.error.msg, '', {
                  timeOut: 3000,
                });
              }
            )
          }
        });
      }
    );

  }

  createAppStepLastForFranchiseExist() {
    this.loading = LoadingState.Processing;
    let data = {
      name: this.stepSix.value.name,
      email_id: this.stepSix.value.email_id,
      contact_no: this.stepSix.value.contact_no
    }
    this.createAppService.createAppStepLastForFranchiseExist(sessionStorage.getItem('storeCreateAppID'), data).subscribe(
      response => {
        console.log(response)
        sessionStorage.removeItem('storeCreateAppID');
        sessionStorage.removeItem('storeCreateAppStep');
        sessionStorage.removeItem('storeSessionID');
        this.loading = LoadingState.Ready;

        this.btnClickNav('payment/' + response['app_master_id'])
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error(error.error.msg, '', {
          timeOut: 3000,
        });
      }
    )

  }

  submitStepSixFranchise() {
    if (this.stepSix.valid) {
      this.loading = LoadingState.Processing;

      let data = {
        user_id: this.logedUserId,
        email_id: this.stepSix.value.email_id,
        contact_no: this.stepSix.value.contact_no
      }
      this.createAppService.sendAppCreateOtp(data).subscribe(
        response => {


          this.loading = LoadingState.Ready;

          console.log(response)
          this.openOtpDialog(response['otp'], this.logedUserId, this.stepSix.value.contact_no, this.stepSix.value.email_id, 'franchiseUser')

        },
        error => {
          this.loading = LoadingState.Ready;
          let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: { msg: error.error.msg }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.createAppStepLastForFranchiseExist()
            }
          });

        }
      );
    }
    else {
      this.markFormGroupTouched(this.stepSix)
    }
  }

  openOtpDialog(otp, user_id, contact_no, email_id, type) {
    let dialogRef = this.dialog.open(OtpDialogComponent, {
      width: '300px',
      data: { otp: otp, user_id: user_id, contact_no: contact_no, email_id: email_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type == 'normalUser') {
          this.createOriginalApp();
        }
        else if (type == 'franchiseUser') {
          this.createOriginalAppByFranchise();
        }
      }
    })
  }




}
