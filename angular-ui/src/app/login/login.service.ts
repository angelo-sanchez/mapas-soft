import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token : any = null;

  constructor() {
   }

  login(email: string, password : string){
    console.log(email + ' - ' + password);
  }

  getToken(){
    return this.token;
  }
}
