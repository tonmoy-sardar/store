import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class GeneralService {

  constructor(private http: HttpClient) { }

  send_contact_mail(data): Observable<any> {
    return this.http.post(environment.apiEndpoint + 'send_contact_mail/', data)
  }

}
