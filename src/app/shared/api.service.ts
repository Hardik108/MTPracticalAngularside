import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
options={headers:new HttpHeaders().set('Authorization',this.auth.getToken())};

  constructor(public api:HttpClient,public auth:AuthService) {   }
    // I can use interceptor for tokenizer but due to timeline i've used this trick.

  get(url){
    return this.api.get(environment.baseUrl+url,this.options);
  }
  post(url,data){
    return this.api.post(environment.baseUrl+url,data,this.options);
  }
  put(url,id,data){
    return this.api.put(environment.baseUrl+url+'/'+id,data,this.options);
  }
  remove(url,id){
    return this.api.delete(environment.baseUrl+url+'/'+id,this.options);
  }
  getbyid(url,id){
    return this.api.get(environment.baseUrl+url+'/'+id,this.options);
  }
}
