import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  public listItemSelected : string = 'Mapas';


  
  constructor() { }

  ngOnInit(): void {
  }

}

