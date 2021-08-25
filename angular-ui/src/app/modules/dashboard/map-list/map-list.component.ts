import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import {MapData, MapListService} from '../map-list/map-list-service'
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements AfterViewInit {

	
	@ViewChild(MatMenuTrigger)
	contextMenu!: MatMenuTrigger;
  
	contextMenuPosition = { x: '0px', y: '0px' };

	displayedColumns: string[] = ['name', 'owner', 'date_creation'];
	listado: boolean = true;
	
	public mapList = new MatTableDataSource<MapData>();
	public item: MapData|null = null;

	constructor(private mapListService: MapListService) {
	}
	ngAfterViewInit(): void {
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
	@HostListener('document:contextmenu', ['$event', 'row'])
	onContextMenu(event: MouseEvent, map: MapData) {
		event.preventDefault();
		event.stopPropagation();
		this.contextMenu.closeMenu();
		if(!map) {
			return;
		}
		this.contextMenuPosition.x = event.clientX + 'px';
		this.contextMenuPosition.y = event.clientY + 'px';
		this.item = map;
		this.contextMenu.menu.focusFirstItem('mouse');
		this.contextMenu.menu.hasBackdrop = false;
		this.contextMenu.openMenu();
	}

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent){
		event.preventDefault();
		event.stopPropagation();
		this.contextMenu.closeMenu();
	}

	eliminar(item: MapData|null) {
		if(item) this.mapListService.deleteMaps([item.id]).subscribe(data => {
			this.mapList.data = this.mapList.data.filter(map => map.id != item.id);
		})
	}
}
