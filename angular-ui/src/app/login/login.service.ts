import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token : any = null;

  public urlLocal : string = 'http://localhost:3000/';

  constructor(
    public httpClient : HttpClient,
  ) {}

  login(email: string, password : string){
    let url = this.urlLocal + 'signin';

    let body = {
      'email': email,
      'password' : password
    }
    return this.httpClient.post(url,body);
  }

  getToken(){
    return this.token;
  }
}
