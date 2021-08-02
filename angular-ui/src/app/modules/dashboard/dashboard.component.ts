import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public title = 'mapas-soft';
  public sidenav : boolean = false;
  public user = {
    'nombre' : 'Usuario',
    'apellido' : 'Usuario'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
