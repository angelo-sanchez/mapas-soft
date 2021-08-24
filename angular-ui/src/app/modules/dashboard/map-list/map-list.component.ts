import { Component, OnInit } from '@angular/core';
import {MapData, Maps, MapListService} from '../map-list/map-list-service'
import {Observable, of} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements OnInit {
	displayedColumns: string[] = ['name', 'owner', 'date_creation'];
	listado: boolean = true;
	
	public mapList = new MatTableDataSource<MapData>();

	constructor(private mapListService: MapListService) {
	}
	ngOnInit(): void {
		this.mapListService.getMaps().subscribe(maps => 
			this.mapList.data = maps
		);
	}

	subirArchivo(event:any){
		const fileList = (event.target.files as FileList);
		let fd = new FormData();
		
		for (let i = 0; i < fileList.length; i++) {
			const file = fileList.item(i);
			if(!file) continue;
			fd.append('file', file);
		}

		this.mapListService.insertMaps(fd).subscribe((data:any) => {
			let maps = [...this.mapList.data];
			maps.push(...data.maps);
			maps.sort((map1, map2) => map1.name.localeCompare(map2.name));
			this.mapList.data = maps;
			//mostrarErrores(data.errors);
		}, error => {
			console.error(error);
		});
	}

}
