import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaytamService } from '../../core/services/paytam.service';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-paytam',
  templateUrl: './paytam.component.html',
  styleUrls: ['./paytam.component.scss']
})
export class PaytamComponent implements OnInit {
  payment_details;
  paymentdetails_data = {};
  shyamStoreApp = true;
  paymentFormActive;
  lastAction: string;
  totalPrice;
  appList =[];
  events = [{}]
 
  constructor(
    private paytamService: PaytamService
  ) { }

  ngOnInit() {

   this.appList = [
      { appName: 'Shyam app store price', price: '10.00' },
      { appName: 'Website price', price: '10.00' },
      { appName: 'Google app store', price: '10.00' },
      { appName: 'itunes store', price: '10.00' }
    ];
    this.totalPrice =  parseFloat(this.appList[0].price);
    

    this.paymentFormActive = false;
    this.getPaymentSettingsDetails();

    var checksLen = this.appList.length;
    for (var i = 0; i < checksLen; i += 1) {
      if (i == 0) {
        this.appList[i]['checked'] = true;
        this.appList[i]['setDisabled'] = true;
      }
      else {
        this.appList[i]['checked'] = false;
        this.appList[i]['setDisabled'] = false;
      }

    }
    this.events = this.appList;
  }

  onChange(event, index, item) {
    if (item.checked = !item.checked) {
      this.totalPrice = this.totalPrice + parseFloat(item.price);
    }
    else {
      this.totalPrice = this.totalPrice - parseFloat(item.price);
    }
  }
  patyamPayments(event, item) {
    if (this.totalPrice == 0.00) {
      alert('Please check one');
    }
    else {
      this.paymentFormActive = true;
    }
  }


  getPaymentSettingsDetails() {
    this.paytamService.getPaymentDetailsResponse(100).subscribe((data => {
      console.log(data)
      this.paymentdetails_data = data
    }

    ),
    );
  }


}
