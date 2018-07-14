import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import  { PaytamService } from '../../core/services/paytam.service';


@Component({
  selector: 'app-paytam',
  templateUrl: './paytam.component.html',
  styleUrls: ['./paytam.component.scss']
})
export class PaytamComponent implements OnInit {
  payment_details;
  paymentdetails_data = {};
  form: FormGroup;
  paymentFormActive;
  lastAction: string;
  totalPrice = 0.00;
  data = [
    { appName: 'Android', price :'5000.00', checked: false },
    { appName: 'ios', price :'5000.00', checked: false },
    { appName: 'other', price :'5000.00', checked: false }
    
    ];

 

  constructor(
    private paytamService : PaytamService,
    private fb : FormBuilder
    
  ) { }

  ngOnInit() {
    this.paymentFormActive=false;
    this.getPaymentSettingsDetails();
  
  }

  onChange(event, index, item) {
    if(item.checked = !item.checked) {
      this.totalPrice =  this.totalPrice + parseFloat(item.price);
    }
    else{
     this.totalPrice =  this.totalPrice - parseFloat(item.price);
    }
 }
 patyamPayments(event,item){
   if(this.totalPrice==0.00){
       alert('Please check one');
   }
   else{
    this.paymentFormActive=true;
   }
 }

  
  getPaymentSettingsDetails(){
    this.paytamService.getPaymentDetailsResponse(100).subscribe((data=>{
        console.log(data)
        this.paymentdetails_data = data
    }
    
    ),
  );
}

 
}
