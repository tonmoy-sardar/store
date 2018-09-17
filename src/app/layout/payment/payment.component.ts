import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TermsDialogComponent } from '../../core/component/terms-dialog/terms-dialog.component'
import { PaytamService } from '../../core/services/paytam.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  isLoggedin: boolean;
  user_name: string;
  paymentdetails_data: any;
  totalPrice: number;
  paymentFormActive: boolean;
  // 
  priceList: any = [];
  price_id: any = [];
  subscription_type_id: number;
  subscription_value: number;
  subscriptionTypeList: any = [];
  offerList: any = [];
  offer_price: number = 0;
  coupon_code: string;
  referral_code: string;
  app_id: number;
  user_id: number;
  user_group: string = '';
  termsAndConditionChecked = false;
  cuponForm: FormGroup;
  referralForm: FormGroup;
  referral_user_id: number;
  constructor(
    private paytamService: PaytamService,
    private router: Router,
    public dialog: MatDialog,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = sessionStorage.getItem('logedUserUserName')
      if (sessionStorage.getItem('logedUserUserGroup')) {
        this.user_group = sessionStorage.getItem('logedUserUserGroup')
      }
    }
    this.getPriceList();
    this.getSubscriptionTypeList();
    this.getOfferList();
    this.user_id = this.route.snapshot.params['user_id'];
    this.app_id = this.route.snapshot.params['app_id'];
    this.cuponForm = this.formBuilder.group({
      coupon: [null, Validators.required]
    });
    this.referralForm = this.formBuilder.group({
      referral_code: [null, Validators.required]
    });
  }

  logout() {
    this.isLoggedin = false;
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  onPriceChange(event, index, item) {
    if (item.checked = !item.checked) {
      this.totalPrice = this.totalPrice + parseFloat(item.cost);
      this.price_id.push(item.id)
    }
    else {
      var index = this.price_id.findIndex(item.id)
      if (index != -1) {
        this.price_id.slice(index, 1)
      }
      this.totalPrice = this.totalPrice - parseFloat(item.cost);
    }
  }

  onSubscriptionChange() {
    var arrData = this.subscriptionTypeList.filter(x => x.id == this.subscription_type_id)
    if (arrData.length > 0) {
      this.subscription_value = arrData[0]['days']
    }
  }

  getPriceList() {
    this.createAppService.getPriceList().subscribe(
      res => {
        // console.log(res)
        this.priceList = res;
        for (var i = 0; i < this.priceList.length; i += 1) {
          if (i == 0) {
            this.priceList[i]['checked'] = true;
            this.priceList[i]['setDisabled'] = true;
            this.price_id.push(this.priceList[i].id)
          }
          else {
            this.priceList[i]['checked'] = false;
            this.priceList[i]['setDisabled'] = false;
          }

        }
        this.totalPrice = parseFloat(this.priceList[0].cost);
      },
      error => {
        // console.log(error)
      }
    )
  }

  getSubscriptionTypeList() {
    this.createAppService.getSubscriptionTypeList().subscribe(
      res => {
        // console.log(res)
        this.subscriptionTypeList = res;
        this.subscription_type_id = this.subscriptionTypeList[0]['id'];
        this.subscription_value = this.subscriptionTypeList[0]['days']
      },
      error => {
        console.log(error)
      }
    )
  }

  getOfferList() {
    this.createAppService.getOfferList().subscribe(
      res => {
        // console.log(res)
        this.offerList = res;
      },
      error => {
        console.log(error)
      }
    )
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  apply_coupon() {
    if (this.cuponForm.valid) {
      var valid = this.offerList.filter(x => x.offer_code == this.cuponForm.value.coupon)
      console.log(valid)
      if (valid.length > 0) {
        this.offer_price = valid[0].offer_value;
        this.coupon_code = valid[0].offer_code;
        this.toastr.success('Coupon is applied successfully', '', {
          timeOut: 3000,
        });
      }
      else {
        this.toastr.error('Invalid coupon code', '', {
          timeOut: 3000,
        });
      }
    } else {
      this.markFormGroupTouched(this.cuponForm)
    }
  }

  apply_referral() {
    if (this.referralForm.valid) {
      this.referral_code = this.referralForm.value.referral_code
      var data = {
        referral_code: this.referral_code
      }
      this.createAppService.checkReferralCode(data).subscribe(
        res => {
          console.log(res)
          this.referral_user_id = res['referral_user_id'];
          this.toastr.success('Referral code is applied successfully', '', {
            timeOut: 3000,
          });
        },
        error => {
          console.log(error)
          this.toastr.error('Invalid Referral Code', '', {
            timeOut: 3000,
          });
        }
      )
    } else {
      this.markFormGroupTouched(this.referralForm)
    }
  }


  showTermsAndConditions() {
    let dialogRef = this.dialog.open(TermsDialogComponent, {
      width: '600px',
      data: {}
    });
  }


  getPaidTotal() {
    return (this.subscription_value * this.totalPrice).toFixed(2)
  }


  pay() {
    var sum = this.totalPrice * this.subscription_value - this.offer_price;
    this.getPaymentSettingsDetails(sum);
  }

  getPaymentSettingsDetails(amount) {

    if (this.termsAndConditionChecked == true) {
      this.createAppService.paytmFormValue(this.app_id, amount).subscribe(
        (
          data => {
            this.paymentdetails_data = data;
            this.paymentFormActive = true;
            var subscription_data = {
              app_master: +this.app_id,
              subscription_type: this.subscription_type_id,
              price_master: this.price_id[0],
              total_cost: (this.totalPrice * this.subscription_value) - this.offer_price,
              order_id: this.paymentdetails_data['ORDER_ID']
            }
            var arrCoupon = this.offerList.filter(x => x.offer_code == this.coupon_code)
            if (arrCoupon.length > 0) {
              var coupon = arrCoupon[0]['id'];
              subscription_data['offer_code'] = coupon;
            }

            if (this.referral_user_id != null) {
              subscription_data['referral_code_userid'] = this.referral_user_id;
            }

            // console.log(subscription_data)
            this.appSubscribe(subscription_data)
          }
        ),
      );
    }
    else {
      this.toastr.error('Please agree to the terms & conditions', '', {
        timeOut: 3000,
      });
    }
  }

  appSubscribe(data) {
    this.createAppService.appSubscription(data).subscribe(
      res => {
        console.log(res)
        let btn: HTMLElement = document.getElementById('payment_btn') as HTMLElement;
        setTimeout(function () {
          btn.click();
        }, 100);
      },
      error => {
        console.log(error)
      }
    )
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && (form.get(field).dirty || form.get(field).touched);
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



