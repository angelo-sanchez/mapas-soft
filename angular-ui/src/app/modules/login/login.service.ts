import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public urlLocal: string = environment.apiUrl;

  constructor(
    public httpClient: HttpClient,
    private route: Router,
  ) { }

  login(email: string, password: string) {
    let url = this.urlLocal + '/login';
    let body = { email, password };
    return this.httpClient.post(url, body);
  }

  register(email: string, password: string) {
    let url = this.urlLocal + '/register';
    let body = { email, password };
    return this.httpClient.post(url, body);
  }

  logout() {
    let url = this.urlLocal + '/logout';
    this.httpClient.get(url).subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenValidBefore');
      this.route.navigate(['/login']);
    }, error => {
      console.log('Se produjo un error al intentar cerrar sesión');
      console.log(error);
    });
  }

  getToken() {
    if (+(localStorage.getItem('tokenValidBefore') || 0) <= Date.now())
      this.logout();
    return localStorage.getItem('token');
  }

  setToken(token: any, validity: number, emmited: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenValidBefore', `${+emmited + validity * 1000}`);
  }

  getUser() {
    if (+(localStorage.getItem('tokenValidBefore') || 0) <= Date.now())
      return null;
    let u = localStorage.getItem('user');
    if (u)
      return JSON.parse(u);
    return null;
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAutenticado() {
    return this.getToken() != null;
  }
}
