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
  pytamFormVal;
  form: FormGroup;

  lastAction: string;
  totalPrice = 0.00;
  data = [
    { appName: 'Android', price :'5000.00', checked: false },
    { appName: 'ios', price :'5000.00', checked: false },
    { appName: 'other', price :'5000.00', checked: false }
    
    ];

  onChange(event, index, item) {
     if(item.checked = !item.checked) {
       this.totalPrice =  this.totalPrice + parseFloat(item.price);
     }
     else{
      this.totalPrice =  this.totalPrice - parseFloat(item.price);
     }
  }
 

  constructor(
    private paytamService : PaytamService,
    private fb : FormBuilder
    
  ) { }

  ngOnInit() {
    //Sandbox Merchant ID : testtu84067624389986
    //Website Url :http://shyamfuture.com/
   // Sandbox Merchant Key : 1E63QFGCt09ttJoW
   // Channel Id :WEB
    //Industry Type : Retail
    // this.paytamForm = this.fb.group({
    //   'MID': ['testtu84067624389986', Validators.required],
    //    'ORDERID':['7654sdfghj', Validators.required],
    //   'CHECKSUMHASH':['5aVR8KqkoCz9RqoBSszK3ksGfLtI6Rj5teplBdUHk49dh13A', Validators.required],
    // })
    //alert('hi');
   this.paytamService.pytamFormValue(100).subscribe(
    (res: any[]) => {
        this.payment_details = res;
        console.log(res);
   },
    error => {
      console.log(error)
    })
    this.form = this.fb.group({
      MID: [null,Validators.required],
      CHANNEL_ID:[null,Validators.required],
      INDUSTRY_TYPE_ID:[null,Validators.required],
      WEBSITE:[null,Validators.required],
      CALLBACK_URL:[null,Validators.required],
      CUST_ID:[null,Validators.required],
      ORDER_ID:[null,Validators.required],
      TXN_AMOUNT:[null,Validators.required],
      CHECKSUMHASH:[null,Validators.required]
    });

    this.payment_details = {
        MID: '',
        CHANNEL_ID: '',
        INDUSTRY_TYPE_ID: '',
        WEBSITE: '',
        CALLBACK_URL: '',
        CUST_ID: '',
        ORDER_ID: '',
        TXN_AMOUNT: '',
        CHECKSUMHASH: ''

    };

    
  
  }

  

  patyamPayment()
  {
    console.log('sss')
    window.location.href = 'https://securegw-stage.paytm.in/theia/processTransaction';
 
    //   this.paytamService.patyamPayments(this.form.value).subscribe(res=>{
  //     console.log('dfdssfsdsf')
  //   },
    
  //     error => {
  //       console.log(error)
  //     }
    
  //   )
  //   console.log( this.form.value);
   }
 
}
