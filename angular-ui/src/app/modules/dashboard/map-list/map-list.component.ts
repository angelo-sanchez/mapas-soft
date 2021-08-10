import { Component, OnInit } from '@angular/core';
import {MapData, Maps, MapListService} from '../map-list/map-list-service'
import {Observable} from 'rxjs';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements OnInit {
	displayedColumns: string[] = ['name', 'owner', 'date_creation'];
	maps$: Observable<Maps>;
	listado: Boolean;
	constructor(private mapListService: MapListService) {
		this.maps$ = new Observable();
		this.listado = true;
	}
	ngOnInit(): void {
		this.maps$ = this.mapListService.getMaps();
	}
}
