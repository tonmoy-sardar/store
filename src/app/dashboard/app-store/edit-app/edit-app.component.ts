import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CreateAppService } from '../../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { PlatformLocation } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { LoadingState } from '../../../core/component/loading/loading.component';
import { forkJoin } from "rxjs/observable/forkJoin";
@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit {
  isLoggedin: boolean;
  user_name: string;
  user_group: string = '';
  loading: LoadingState = LoadingState.NotReady;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('search') public searchElement: ElementRef;
  stepOne: FormGroup;
  stepThree: FormGroup;
  stepFour: FormGroup;
  stepFive: FormGroup;
  stepFiveDataCatProd: FormGroup;
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
  setp_three_data = {
    owner_name: '',
    owner_pic: '',
    owner_designation: '',
    store_address: '',
    lat: '',
    long: '',
    business_est_year: ''
  }

  step_four_data = {
    website_url: ''
  }

  step_five_data = {
    product_categories: [
      {
        id: null,
        app_master: this.route.snapshot.params['id'],
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
          app_master: this.route.snapshot.params['id'],
          product_category: '',
          product_name: '',
          price: '',
          discounted_price: '0.00',
          packing_charges: '0.00',
          tags: '',
        }
      ]
    }
  ]
  category_confirm_key: boolean;

  user_app_details: any;  

  base_url: string;

  isLinear = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private createAppService: CreateAppService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private platformLocation: PlatformLocation,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = localStorage.getItem('logedUserUserName');
      if (localStorage.getItem('logedUserUserGroup')) {
        this.user_group = localStorage.getItem('logedUserUserGroup')
      }
    }

    this.base_url = (this.platformLocation as any).location.origin;
    this.stepOne = this._formBuilder.group({
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

    this.stepFiveDataCatProd = this._formBuilder.group({
      product_cols: this._formBuilder.array([this.createProductCols()]),
    })    

    this.getAppDetails(this.route.snapshot.params['id']);
    this.getDesignationDropdown();
    this.mapLoader();
  }

  logout() {
    this.isLoggedin = false;
    localStorage.clear();
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
  getAppDetails(id) {
    this.createAppService.getAppDetails(id).subscribe(
      data => {
        console.log(data);
        this.user_app_details = data;
        this.step_one_data.logo = data.logo;
        this.step_one_data.business_name = data.business_name;
        if (!this.step_one_data.business_name) {
          this.haveBusinessName = true;
        }


        this.step_one_data.business_description = data.business_description;

        if (!this.step_one_data.business_description) {
          this.haveBusinessDescription = true;
        }

        this.setp_three_data.owner_pic = data.owner_pic;
        this.setp_three_data.owner_name = data.owner_name;
        this.setp_three_data.owner_designation = data.owner_designation;
        this.setp_three_data.store_address = data.store_address;
        this.setp_three_data.lat = data.lat;
        this.setp_three_data.long = data.long;
        this.setp_three_data.business_est_year = data.business_est_year;


        this.step_four_data.website_url = data.app_url;
        this.step_one_data.business_photos = [];
        for (var i = 0; i < data.app_imgs.length; i++) {
          var business_img_url = environment.urlEndpoint + data.app_imgs[i].app_img;
          this.step_one_data.business_photos.push(business_img_url)
        }

        if (data.app_product_categories.length > 0) {
          this.step_five_data.product_categories = [];
          this.setp_five_data_cat_prod = [];

          const category_control = <FormArray>this.stepFive.controls['product_categories'];
          const product_cols_control = <FormArray>this.stepFiveDataCatProd.controls['product_cols'];
          for (var i = 0; i < data.app_product_categories.length; i++) {
            if (i < data.app_product_categories.length - 1) {
              category_control.push(this.createProductCategory(''));
              product_cols_control.push(this.createProductCols());
            }

            var prod_cat = {
              id: data.app_product_categories[i].id,
              app_master: id,
              category_name: data.app_product_categories[i].category_name,
              description: ''

            }
            this.step_five_data.product_categories.push(prod_cat);

            var catProdData = {
              products: [
                {
                  id: null,
                  app_master: this.route.snapshot.params['id'],
                  product_category: data.app_product_categories[i].id,
                  product_name: '',
                  price: '',
                  discounted_price: '0.00',
                  packing_charges: '0.00',
                  tags: '',
                }
              ]
            }

            this.setp_five_data_cat_prod.push(catProdData);
            if (data.app_product_categories[i].products.length > 0) {
              const product_rows_control = (<FormArray>this.stepFiveDataCatProd.controls['product_cols']).at(i).get('products') as FormArray;
              console.log(data.app_product_categories[i].products.length)
              for (var j = 0; j < data.app_product_categories[i].products.length; j++) {
                var prod = {
                  id: data.app_product_categories[i].products[j].id,
                  app_master: this.route.snapshot.params['id'],
                  product_category: data.app_product_categories[i].id,
                  product_name: data.app_product_categories[i].products[j].product_name,
                  price: data.app_product_categories[i].products[j].price,
                  discounted_price: data.app_product_categories[i].products[j].discounted_price,
                  packing_charges: data.app_product_categories[i].products[j].packing_charges,
                  tags: data.app_product_categories[i].products[j].tags
                }

                if (j == 0) {
                  this.setp_five_data_cat_prod[i].products.splice(j, 1)
                }
                this.setp_five_data_cat_prod[i].products.splice(j, 0, prod);
                if (j < data.app_product_categories[i].products.length - 1) {
                  product_rows_control.push(this.createProduct());
                }

              }
            }
            this.category_confirm_key = true;

          }
        }
        this.loading = LoadingState.Ready;
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }

  submitCategory() {

    if (this.stepFive.valid) {
      this.loading = LoadingState.Processing;
      console.log(this.step_five_data);
      this.createAppService.editOrgProductCategory(this.route.snapshot.params['id'], this.step_five_data).subscribe(
        response => {
          console.log(response);
          this.loading = LoadingState.Ready;
          const product_categories_control = <FormArray>this.stepFive.controls['product_categories'];
          for (var i = this.step_five_data.product_categories.length - 1; i > 0; i--) {
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

          this.getAppDetails(this.route.snapshot.params['id']);

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


  ownerLogoChange(ownerfile: FileList) {
    const reader = new FileReader();
    if (ownerfile && ownerfile.length) {
      const file = ownerfile.item(0);
      this.ownerToUpload = file;
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.setp_three_data.owner_pic = event.target.result;
        this.cd.markForCheck();
      };
    }
  }

  submitProduct() {
    var i = 0;
    var forkArray = []
    this.setp_five_data_cat_prod.forEach(x => {
      var data = {
        products: []
      };
      x.products.forEach(y => {
        if (y.product_name != "" && y.price != "") {
          data.products.push(y)
        }
        else {

        }
      })
      if (data.products.length > 0) {
        this.loading = LoadingState.Processing;
        forkArray.push(this.createAppService.editOrgProduct(this.route.snapshot.params['id'], data))
      }
      i++;
    })
    if (i == this.setp_five_data_cat_prod.length) {
      forkJoin(forkArray).subscribe(results => {
        this.toastr.success('Success', '', {
          timeOut: 3000,
        });
        const product_categories_control = <FormArray>this.stepFive.controls['product_categories'];
        for (var i = this.step_five_data.product_categories.length - 1; i > 0; i--) {
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
        this.getAppDetails(this.route.snapshot.params['id']);
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
      app_master: this.route.snapshot.params['id'],
      category_name: '',
      description: ''
    }
    this.step_five_data.product_categories.push(product_cate)

    const control = <FormArray>this.stepFive.controls['product_categories'];
    control.push(this.createProductCategory(''));
  }

  deleteProductCategory(index: number) {
    if (index > -1) {
      this.step_five_data.product_categories.splice(index, 1)
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
    console.log(this.step_five_data)
    console.log(this.stepFive.value)
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
      app_master: this.route.snapshot.params['id'],
      product_category: product_cat_id,
      product_name: '',
      price: '',
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
      price: ['', Validators.required],
      discounted_price: ['0.00'],
      packing_charges: ['0.00'],
      tags: [''],
    });
  }


  submitStepOne() {

    if (this.stepOne.valid) {
      this.loading = LoadingState.Processing;
      this.createAppService.updateAppStepOne(this.route.snapshot.params['id'], this.logoToUpload, this.stepOne.value).subscribe(
        response => {
          if (this.business_photo_arr.length > 0) {
            for (let i = 0; i < this.business_photo_arr.length; i++) {
              this.createAppService.uploadOrgBusinessImages(this.route.snapshot.params['id'], this.business_photo_arr[i]).subscribe(
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
                this.loading = LoadingState.Ready;
                this.toastr.success('Success', '', {
                  timeOut: 3000,
                });
                this.stepper.next()
              }
            }
          }
          else {
            this.loading = LoadingState.Ready;
            this.toastr.success('Success', '', {
              timeOut: 3000,
            });
            this.stepper.next()
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
      this.markFormGroupTouched(this.stepOne)
    }
  }

  submitStepThree() {
    if (this.stepThree.valid) {
      this.loading = LoadingState.Processing;
      console.log(this.stepThree.value)
      this.createAppService.updateOwnerInfo(this.route.snapshot.params['id'], this.ownerToUpload, this.stepThree.value).subscribe(
        response => {
          this.loading = LoadingState.Ready;
          this.toastr.success('Success', '', {
            timeOut: 3000,
          });
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
          this.stepper.next()
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

  nextStep(value) {
    // this.storeCreateAppStep = parseInt(value) - 1;
    // localStorage.setItem('storeCreateAppStep', this.storeCreateAppStep);
  }

  save_nextStep(id) {
    this.loading = LoadingState.Processing
    var keepCatGoing = true;
    var keepProdGoing = true;
    if (this.user_app_details.app_product_categories.length != this.step_five_data.product_categories.length) {
      this.step_five_data.product_categories.forEach(x => {
        if (x.category_name != "" && keepCatGoing) {
          this.loading = LoadingState.Ready
          this.toastr.error('Please confirm category', '', {
            timeOut: 3000,
          });
          keepCatGoing = false;
        }
      })
    }
    for (var i = 0; i < this.setp_five_data_cat_prod.length; i++) {
      var d = this.setp_five_data_cat_prod[i];
      var k = this.user_app_details.app_product_categories[i]
      if (d.products.length != k.products.length) {
        d.products.forEach(y => {
          if (y.product_name != "" && y.price != "" && keepProdGoing) {
            this.loading = LoadingState.Ready
            this.toastr.error('Please confirm product', '', {
              timeOut: 3000,
            });
            keepProdGoing = false;
          }
        })
      }
    }
    if (keepCatGoing && keepProdGoing) {
      this.loading = LoadingState.Ready
      this.router.navigateByUrl('/payment/' + id);
    }

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
    if (event.target.files.length > 3) {
      this.toastr.error('You can not upload more than three business images', '', {
        timeOut: 3000,
      });
    }
    else {
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
