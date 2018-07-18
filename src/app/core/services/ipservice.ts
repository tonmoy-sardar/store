import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Injectable()
export class IpserviceService {

    url: string;
    constructor(private http: HttpClient) {
     // this.url  = 'https://api.datamuse.com/words?ml='
     }
  
    //  getIpAddress(): Observable<any> {
    //     return this.http.get('https://jsonip.com');     
    //   }
     
    //   getLocation(ip){
    //       return this.http.get('https://ipinfo.io/'+ip)
    //             .subscribe(data=>{
    //               console.log('test',data);
    //             });
    //   }
}