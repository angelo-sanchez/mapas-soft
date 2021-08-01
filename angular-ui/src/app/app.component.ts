import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title = 'mapas-soft';
  public sidenav : boolean = false;
  public user = {
    'nombre' : 'Usuario',
    'apellido' : 'Usuario'
  }



}
