import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
@Injectable()
export class FranchiseUserService {

  constructor(private http: HttpClient) { }

  getFranchiseUserList(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'app_user_list_by_frid/' + id + '/')
  }

}
