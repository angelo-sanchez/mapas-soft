import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MapData } from '../maps-section-service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css']
})
export class GridViewComponent implements OnInit {

  @Input() public maps : MatTableDataSource<MapData> = new MatTableDataSource<MapData>(); 

  constructor() { }

  ngOnInit(): void {

  }

}
