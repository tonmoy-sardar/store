import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaytamService {

  constructor(private http: HttpClient) { }

  // patyamPayments(data): Observable<any>{
  //   return this.http.post('https://securegw-stage.paytm.in/theia/processTransaction', data)
  // }

  getPaymentDetailsResponse(price): Observable<any>{
    //console.log(formData['name'])
    return this.http.get('http://192.168.24.208:8000/paytm/get_payment_details/?order_amount='+price)
  }

  pytamFormValue(order_amount):Observable<any>{
    return this.http.get(environment.apiEndpoint + 'get_payment_details/?order_amount='+order_amount+'type=web')
  }
}
