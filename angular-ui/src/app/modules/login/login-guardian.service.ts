import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardianService implements CanActivate {
  

  constructor(
    private loginService : LoginService,
    private router : Router
  ) { }

  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){
    if(this.loginService.isAutenticado()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
