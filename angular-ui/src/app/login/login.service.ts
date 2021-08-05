import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token : any = null;

  public urlLocal : string = 'http://localhost:3000/';

  constructor(
    public httpClient : HttpClient,
    private route : Router,
  ) {}

  login(email: string, password : string){
    let url = this.urlLocal + 'login';
    let body = {email, password};
    this.httpClient.post(url,body).subscribe((data : any) =>{
      this.token = data.token;
      this.route.navigate(['/']);
    }, error => {
      console.log('Se produjo un error al iniciar sesion.');
      console.log(error);
    });
  }

  register(email: string, password : string){
    let url = this.urlLocal + 'register';
    let body = {email, password};
    this.httpClient.post(url,body).subscribe(data =>{
      if(data){
        this.route.navigate(['/login']);
      }
    },error => {
      console.log('Se produjo un error al registrar el usuario ' + email);
      console.log(error);
    });
  }

  logout(){
    console.log('entre');
    let url = this.urlLocal + 'logout';
    this.httpClient.get(url).subscribe(() => {
      console.log('entre opcion 1');
      this.token = null;
      this.route.navigate(['/login']);
    },error => {
      console.log('Se produjo un error al intentar cerrar sesión');
      console.log(error);
    }); 
    console.log('entre opcion 2');
  }

  getToken(){
    return this.token;
  }

  isAutenticado(){
    return this.token != null;
  }
}
 