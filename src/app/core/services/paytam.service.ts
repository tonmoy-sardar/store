import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaytamService {

  constructor(private http: HttpClient) { }

  patyamPayments(data): Observable<any>{
    return this.http.post('https://securegw-stage.paytm.in/theia/processTransaction', data)
  }

  // patyamPayments(): Observable<any>{
  //   return this.http.get(environment.apiEndpoint + 'payment_request/')
  // }

  pytamFormValue(order_amount):Observable<any>{
    return this.http.get(environment.apiEndpoint + 'get_payment_details/?order_amount='+order_amount)
  }
}
