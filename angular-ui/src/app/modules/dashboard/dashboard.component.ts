import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/modules/login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public title = 'mapas-soft';
  public sidenav : boolean = false;
  public user : any = null;

  constructor(private loginService : LoginService) { }

  ngOnInit(): void {
    this.user = this.loginService.getUser();
  }

  logout(){
    this.loginService.logout();
  }

}
