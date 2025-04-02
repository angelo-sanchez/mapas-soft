import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardianService implements CanActivate {
  
  constructor(
    private loginService : LoginService,
    private router : Router
  ) { }

  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){
    if(this.loginService.isAutenticado()){
        this.router.navigate(['/maps']);
        return false;
    }
    return true;
  }
}
