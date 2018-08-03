import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CouponDialogComponent } from '../../core/component/coupon-dialog/coupon-dialog.component'
import { PaytamService } from '../../core/services/paytam.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreateAppService } from '../../core/services/create-app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentdetails_data = {};
  totalPrice: number;

  // 
  priceList: any = [];
  subscription_type_id;
  subscription_value: number;
  subscriptionTypeList: any = [];
  offerList: any = [];
  offer_price: number = 0;
  coupon_code: string;
  constructor(
    private paytamService: PaytamService,
    private router: Router,
    public dialog: MatDialog,
    private createAppService: CreateAppService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    // this.getPaymentSettingsDetails(); 
    this.getPriceList();
    this.getSubscriptionTypeList();
    this.getOfferList();
  }

  onPriceChange(event, index, item) {
    if (item.checked = !item.checked) {
      this.totalPrice = this.totalPrice + parseFloat(item.cost);
    }
    else {
      this.totalPrice = this.totalPrice - parseFloat(item.cost);
    }
  }


  getPaymentSettingsDetails() {
    this.paytamService.getPaymentDetailsResponse(100).subscribe(
      (
        data => {
          console.log(data)
          this.paymentdetails_data = data
        }

      ),
    );
  }

  onSubscriptionChange() {
    if (this.subscription_type_id == 1) {
      this.subscription_value = 30
    }
    if (this.subscription_type_id == 2) {
      this.subscription_value = 180
    }
    if (this.subscription_type_id == 3) {
      this.subscription_value = 365
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
        this.subscription_value = 30
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
    let dialogRef = this.dialog.open(CouponDialogComponent, {
      width: '300px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var valid = this.offerList.filter(x => x.offer_code == result.coupon.toUpperCase())
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
      }
    })
  }

  getPaidTotal() {
    return (this.subscription_value * this.totalPrice).toFixed(2)
  }

}
