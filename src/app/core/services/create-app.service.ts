import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class CreateAppService {

  constructor(private http: HttpClient) { }

  customer_login(data): Observable<any> {
    return this.http.post(environment.apiEndpoint + 'customer_login/', data)
  }

  getCategoryList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'all_categories/')
  }

  createTempApp(data): Observable<any> {
    return this.http.post(environment.apiEndpoint + 'create_app/', data)
  }

  editCategoryMaping(id, data): Observable<any> {

    return this.http.put(environment.apiEndpoint + 'edit_category_maping/' + id + '/', data)
  }


  getTempAppDetails(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'create_app_details/' + id + '/')
  }

  getAppDetails(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'app_all_details/' + id + '/')
  }
  

  logoUploadSection(id, logoToUpload, data): Observable<any> {
    const formData: FormData = new FormData();
    let logo;
    if (data) {
      for (let key in data) {
        if(key!='logo' && key!='business_photos')
        {
          formData.append(key, data[key])
        }
      }
    }

    if (logoToUpload) {
      logo = logoToUpload.name
      formData.append('logo', logoToUpload, logo);
    }

    return this.http.put(environment.apiEndpoint + 'create_app_step_one/' + id + '/', formData)

  }

  submitOwnerInfo(id,session_id, ownerToUpload, data): Observable<any> {

    const formData: FormData = new FormData();
    let owner_pic;
    if (data) {
      for (let key in data) {
        if(key!='owner_pic')
        {
          formData.append(key, data[key])
        } 
      }
    }

    if (ownerToUpload) {
      owner_pic = ownerToUpload.name
      formData.append('owner_pic', ownerToUpload, owner_pic);
    }

    formData.append('session_id', session_id);

    return this.http.put(environment.apiEndpoint + 'create_app_step_two/' + id + '/', formData)

  }


  uploadBusinessImages(app_id, appImageToUpload): Observable<any> {

    const formData: FormData = new FormData();
    let app_images;


    if (appImageToUpload) {
      if (!app_images) {
        app_images = appImageToUpload.name
      }
      formData.append('app_images', appImageToUpload, app_images);
    }

    formData.append('app', app_id);

    return this.http.post(environment.apiEndpoint + 'create_app_step_three/', formData)

  }

  updateTempAppURL(data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'insert_app_url/' + data.id + '/', data)
  }

  getTempUserDetails(session_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'app_user_details/' + session_id + '/')
  }

  createOriginalApp(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'create_app_step_last/' + id + '/', data)
  }


  createProductCategory(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'edit_product_Categories/' + id + '/', data)
  }

  createProduct(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'edit_product/' + id + '/', data)
  }

  getDesignationDropdown(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'dropdown_designations/')
  }


  getAppAnduserDetailsByUserID(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'app_and_user_details/' + id + '/')
  }


  editOrgProductCategory(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'org_product_categories_edit/' + id + '/', data)
  }

  editOrgProduct(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'org_product_edit/' + id + '/', data)
  }

  updateOrgAppURL(data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'insert_org_app_url/' + data.id + '/', data)
  }


  updateOrgAppStepOne(app_id, logoToUpload, appImageToUpload,data): Observable<any> {

    const formData: FormData = new FormData();
    let app_images;

    let logo;

    if (data) {
      for (let key in data) {
        if(key!='logo' && key!='business_photos')
        {
          formData.append(key, data[key])
        }
      }
    }

    if (logoToUpload) {
      logo = logoToUpload.name
      formData.append('logo', logoToUpload, logo);
    }

    if (appImageToUpload) {
      if (!app_images) {
        app_images = appImageToUpload.name
      }
      formData.append('app_images', appImageToUpload, app_images);
    }

    formData.append('app', app_id);

    return this.http.post(environment.apiEndpoint + 'edit_step1_app_master/' + app_id + '/', formData)

  }
 


  updateAppStepOne(app_id, logoToUpload,data): Observable<any> {
    const formData: FormData = new FormData();
    let logo;

    if (data) {
      for (let key in data) {
        if(key!='logo' && key!='business_photos')
        {
          formData.append(key, data[key])
        }
      }
    }

    if (logoToUpload) {
      logo = logoToUpload.name
      formData.append('logo', logoToUpload, logo);
    }

    return this.http.put(environment.apiEndpoint + 'edit_applogo_&_appname/' + app_id + '/', formData)
  }

  updateOwnerInfo(id,ownerToUpload, data): Observable<any> {

    const formData: FormData = new FormData();
    let owner_pic;
    if (data) {
      for (let key in data) {
        if(key!='owner_pic')
        {
          formData.append(key, data[key])
        } 
      }
    }

    if (ownerToUpload) {
      owner_pic = ownerToUpload.name
      formData.append('owner_pic', ownerToUpload, owner_pic);
    }

    

    return this.http.put(environment.apiEndpoint + 'edit_owner_info/' + id + '/', formData)

  }


  uploadOrgBusinessImages(app_id, appImageToUpload): Observable<any> {

    const formData: FormData = new FormData();
    let app_images;


    if (appImageToUpload) {
      if (!app_images) {
        app_images = appImageToUpload.name
      }
      formData.append('app_images', appImageToUpload, app_images);
    }

    formData.append('appmaster', app_id);

    return this.http.post(environment.apiEndpoint + 'upload_multiple_imgs/', formData)

  }
  

  createOriginalAppWithLogin(id,data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'create_app_step_last_for_user/' + id + '/', data)
  }



}
