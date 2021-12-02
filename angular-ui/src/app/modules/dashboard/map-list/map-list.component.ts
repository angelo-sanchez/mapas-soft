import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import {MapData, MapListService} from '../map-list/map-list-service'
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { UploadingFileProgressComponent } from '../general-component/uploading-file-progress/uploading-file-progress.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MapWsService } from '../../websocket/map-ws.service';
@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({display: 'none' ,height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*', display : 'block'})),
      transition('expanded <=> collapsed', animate('1ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MapListComponent implements AfterViewInit {

	@ViewChild(MatMenuTrigger)
	contextMenu!: MatMenuTrigger;
	contextMenuPosition = { x: '0px', y: '0px' };

	public mapList = new MatTableDataSource<MapData>();
	public displayedColumns: string[] = ['name', 'owner', 'date_creation', 'loading'];
	public expandedElement : any;

	public listado: boolean = true;
	public asc: boolean = true;
	public fechaAsc: boolean = true
	public item: MapData|null = null;

	public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  	public verticalPosition: MatSnackBarVerticalPosition = 'bottom';

	public itemSeleccionado : any;
	public verVistaDetalle : boolean = false;

	constructor(private mapListService: MapListService,
		private _snackBar: MatSnackBar,
		private mapWsService: MapWsService, ) {
	}
	ngAfterViewInit(): void {
		this.mapListService.getMaps().subscribe(maps => {
				this.mapList.data = maps
				this.sort('nombre', 'asc')
			}
		);
	}

	abrirSnackBar(){
		let files = [{
			name : 'provincias.json',
			done : true
		},
		{
			name: 'municipios.json',
			done : false
		}];


		this._snackBar.openFromComponent(UploadingFileProgressComponent,{
			horizontalPosition: this.horizontalPosition,
			  verticalPosition: this.verticalPosition,
			  data : {
				  cantidad : 2,
				  archivos : files,
			  }
		});
	}

	subirArchivo(event:any){
		console.log({event});
		if(!event.files) return;
		let files = event.files;
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

				// let mensaje = 'Se subió ' + data.maps.length + ' archivo/s correctamente. ';

				// if(data.errors.length > 0){
				// 	mensaje += data.errors.length + ' archivos fallaron al intentar subir.';
				// }
				let archivosLista : any[] = [];

				// Agrego los archivos que se subieron correctamente
				if(data.maps.length > 0){
					data.maps.forEach((file : any) => {
						let obj = {
							name : file.name,
							done : true
						}
						archivosLista.push(obj);
					});
				}

				// Agrego los archivos que se subieron incorrectamente
				if(data.errors.length > 0){
					data.errors.forEach((file : any) => {
						let obj = {
							name : file.name,
							done : false
						}
						archivosLista.push(obj);
					});
				}

				this._snackBar.openFromComponent(UploadingFileProgressComponent,{
					horizontalPosition: this.horizontalPosition,
					  verticalPosition: this.verticalPosition,
					  data : {
						  cantidad : archivosLista.length,
						  archivos : archivosLista,
					  }
				});
				// this._snackBar.open(mensaje,'Aceptar');
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

	sort(tipo: string, ord: string){
		switch(tipo){
			case 'nombre': 
				if(ord === 'desc'){
					this.mapList.data = this.mapList.data.sort((one, two) => (one.name > two.name ? -1 : 1))
				}else{
					this.mapList.data = this.mapList.data.sort((one, two) => (one.name < two.name ? -1 : 1))
				}
				this.asc = !this.asc;
				break;
			case 'fecha':
				if(ord === 'desc'){
					this.mapList.data = this.mapList.data.sort((one, two) => (one.date_creation > two.date_creation ? -1 : 1))
				}else{
					this.mapList.data = this.mapList.data.sort((one, two) => (one.date_creation < two.date_creation ? -1 : 1))
				}
				this.fechaAsc = !this.fechaAsc;
				break;
		}
			
	}

	verDetalle(item : any){
		this.itemSeleccionado = item;
		this.verVistaDetalle = true;
	}

	cerrarVistaDetalle(){
		this.verVistaDetalle = false;
		console.log('cerrando vista detalle')
	}


}