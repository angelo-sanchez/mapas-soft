import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token : any = null;
  private user : any = {email: 'nico@capo.com'};

  public urlLocal : string = 'http://localhost:3000/';

  constructor(
    public httpClient : HttpClient,
    private route : Router,
  ) {}

  login(email: string, password : string){
    let url = this.urlLocal + 'login';
    let body = {email, password};
    return this.httpClient.post(url,body);
  }

  register(email: string, password : string){
    let url = this.urlLocal + 'register';
    let body = {email, password};
    return this.httpClient.post(url,body);
  }

  logout(){
    let url = this.urlLocal + 'logout';
    this.httpClient.get(url).subscribe(() => {
      this.token = null;
      this.route.navigate(['/login']);
    },error => {
      console.log('Se produjo un error al intentar cerrar sesión');
      console.log(error);
    }); 
  }

  getToken(){
    return this.token;
  }

  setToken(token : any){
    this.token = token;
  }

  getUser(){
    return this.user;
  }

  setUser(user: any){
    this.user = user;
  }

  isAutenticado(){
    return this.token != null;
  }
}
 