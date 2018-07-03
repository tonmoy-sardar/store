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

  logoUploadSection(id,logoToUpload,data): Observable<any> {
    const formData: FormData = new FormData();
    let logo;
    if (data) {
      for(let key in data){
          if (key == 'logo'){
            logo = data[key]
          }
        formData.append(key, data[key])
      }
    }

    if (logoToUpload){
      if (!logo){
         logo = logoToUpload.name
      }
      formData.append('logo', logoToUpload, logo);
    }
    console.log(formData);

    return this.http.put(environment.apiEndpoint + 'logo_upload/'+id+'/', formData)

  }

  createTempUser(ownerToUpload,data): Observable<any> {
    const formData: FormData = new FormData();
    let users_pic;
    if (data) {
      for(let key in data){
          if (key == 'users_pic'){
            users_pic = data[key]
          }
       // formData.append(key, data[key])
      }
    }

    if (ownerToUpload){
      if (!users_pic){
        users_pic = ownerToUpload.name
      }
      formData.append('users_pic', ownerToUpload, users_pic);
    }
    
    console.log(formData);

    return this.http.put(environment.apiEndpoint + 'create_tempuser/', formData)

  }

  

 

}
