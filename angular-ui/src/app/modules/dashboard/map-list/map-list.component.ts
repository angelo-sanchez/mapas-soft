import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import {MapData, MapListService} from '../map-list/map-list-service'
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
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

	constructor(private mapListService: MapListService,
		private _snackBar: MatSnackBar) {
	}
	ngAfterViewInit(): void {
		this.mapListService.getMaps().subscribe(maps => 
			this.mapList.data = maps
		);
	}


	subirArchivo(files:any){
		const fileList = (files as FileList);
		let fd = new FormData();
		
		for (let i = 0; i < fileList.length; i++) {
			const file = fileList.item(i);
			if(!file) continue;
			fd.append('file', file);
		}

		this.mapListService.insertMaps(fd).subscribe((data:any) => {
			if(data){
				console.log('Mapas');
				console.log(data);
				let maps = [...this.mapList.data];
				maps.push(...data.maps);
				maps.sort((map1, map2) => map1.name.localeCompare(map2.name));
				this.mapList.data = maps;

				let mensaje = 'Se subió ' + data.maps.length + ' archivo/s correctamente. ';

				if(data.errors.length > 0){
					mensaje += data.errors.length + ' archivos fallaron al intentar subir.';
				}

				this._snackBar.open(mensaje,'Aceptar');
				//mostrarErrores(data.errors);
			} else {
				this._snackBar.open('Se produjo un error al subir un archivo','Aceptar');
			}
		}, error => {
			console.log("Se produjo un error al subir archivos")
			console.error(error);
			this._snackBar.open('Se subió correctamente el archivo','Aceptar');
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
		if(this.contextMenu)
			this.contextMenu.closeMenu();
	}

	eliminar(item: MapData|null) {
		if(item) this.mapListService.deleteMaps([item.id]).subscribe(data => {
			this.mapList.data = this.mapList.data.filter(map => map.id != item.id);
		})
	}

}