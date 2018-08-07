import { Injectable, EventEmitter, Output } from '@angular/core';

import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoginService {

  @Output() getLoggedInStatus: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  login(data): Observable<any>{
    return this.http.post(environment.apiEndpoint+'login/', data)
  }


  loginStatus(data): Observable<any> {
    if (data=true) {
        this.getLoggedInStatus.emit(true);
        return
    } else {
        this.getLoggedInStatus.emit(false);
        return
    }
  }




  

}
