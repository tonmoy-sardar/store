import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class BlogService {

  constructor(private http: HttpClient) { }

  getBlogList(params): Observable<any> {
    return this.http.get(environment.apiEndpointBlog + 'bloglist/?'+params)
  }
  getCategory(): Observable<any> {
    return this.http.get(environment.apiEndpointBlog + 'categoryList/')
  }
  getBlogCategoryWise(catslug): Observable<any> {
    return this.http.get(environment.apiEndpointBlog + 'bloglistbycatidorslug/'+catslug)
  }
  blogSearch(blogname): Observable<any> {
    return this.http.get(environment.apiEndpointBlog + 'bloglist/'+blogname)
  }

  getBlogDetails(slugname): Observable<any> {
    console.log(environment.apiEndpointBlog + 'blogdetailsbyidorslug/'+slugname);
    return this.http.get(environment.apiEndpointBlog + 'blogdetailsbyidorslug/'+slugname)
  }

  mostRecentBlogList(userid): Observable<any> {
    return this.http.get(environment.apiEndpointBlog + 'bloglistmostrecent/'+userid)
  }

  addcomment(data): Observable<any> {
    return this.http.post(environment.apiEndpointBlog + 'addcomment/', data)
  }

}
