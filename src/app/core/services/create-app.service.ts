import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class CreateAppService {

  constructor(private http: HttpClient) { }

  getCategoryList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'all_categories/')
  }

  createTempApp(data): Observable<any> {
    return this.http.post(environment.apiEndpoint + 'create_app/', data)
  }

  logoUploadSection(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'logo_upload/'+id+'/', data)
  }

 

}
