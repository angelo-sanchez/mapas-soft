import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { MapsService } from '../../services/maps.service';
import { MapWsService } from '../../websocket/map-ws.service';
import { MapsSectionService } from './maps-section.service';
import { SelectedMapManagerService } from './selected-map-manager.service';
import { UploadFileOptionsComponent } from '../general-component/upload-file-options/upload-file-options.component';
import { UploadingFileProgressComponent } from '../general-component/uploading-file-progress/uploading-file-progress.component';

import { MapData } from '../../models/map-data.model';

import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MapVisualizerComponent } from '../general-component/map-visualizer/map-visualizer.component';
import { ListViewComponent } from './list-view/list-view.component';

@Component({
	selector: 'app-maps-section',
	templateUrl: './maps-section.component.html',
	styleUrls: ['./maps-section.component.css'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ display: 'none', height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*', display: 'block' })),
			transition('expanded <=> collapsed', animate('1ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class MapsSectionComponent implements OnInit, AfterViewInit {

	@ViewChild("fileUpload", { static: true }) fileInput!: ElementRef<HTMLInputElement>;

	// Lista que contiene los mapas del usuario
	public maps: MapData[] = [];

	// Lista que contiene los mapas seleccionados por el usuario
	public selectedMaps: MapData[] = [];

	// Boolean que controla si se reenderiza list-view o grid-view
	public isListView: boolean = false;

	// Conjunto de variable para la ejecucion del menu de opciones (menu-contextual)
	@ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
	public item: MapData | null = null;
	public contextMenuPosition = { x: '0px', y: '0px' };
	public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
	public verticalPosition: MatSnackBarVerticalPosition = 'bottom';

	@ViewChild('gridView') gridView : any;
  @ViewChild('listView') listView! : ListViewComponent;

	public itemSeleccionado: any;
	public verVistaDetalle: boolean = false;

	public fileOptions: string = "";

	constructor(public mapsSectionService: MapsSectionService,
		private selectedMapManagerService: SelectedMapManagerService,
		private _snackBar: MatSnackBar,
		private mapWsService: MapWsService,
		private mapsService: MapsService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		// Obtener el listado de mapas del usuario
		this.mapsService.mapSubscription().subscribe((data: MapData[]) => {
			this.maps = data;
		});
		this.mapsService.getMaps();

		// Obtener los mapas seleccionados por el usuario
		this.selectedMapManagerService.getSelectedMaps().subscribe((data: MapData[]) => {
			this.selectedMaps = data;
		});

		this.mapWsService.onProgress().subscribe((data) => this.getLog(data));
		this.mapWsService.onFinish().subscribe((data) => this.finalizar(data));
	}


	ngAfterViewInit(): void {
		console.log(this.fileInput);
	}

	// -----------------------------
	// Metodos que ejecutan acciones de hostlistener

	onClick(data: any) {
		let event: MouseEvent = data.event;
		let map: MapData = data.map;

		if (this.contextMenu || this.contextMenu != undefined) { this.contextMenu.closeMenu(); }

		if (event.shiftKey) {
			this.selectedMapManagerService.selectWithShiftCase(this.maps, map);
		} else if (event.ctrlKey) {
			this.selectedMapManagerService.selectWithCtrlCase(map);
		} else {
      if(this.isListView) {
        this.listView.toggleExpanded(map);
      }
      this.selectedMapManagerService.selectWithClickCase(map);
		}
	}

	onContextMenu(data: any) {
		let event: MouseEvent = data.event;
		let map: MapData = data.map;

    this.contextMenu.closeMenu();
    if(!this.selectedMapManagerService.isSelected(map)) {
      this.selectedMapManagerService.resetSelectedMap();
    }
		if (this.selectedMapManagerService.isSelectedMapsEmpty()) {
			this.selectedMapManagerService.selectWithClickCase(map);
		}

		this.contextMenuPosition.x = event.clientX + 'px';
		this.contextMenuPosition.y = event.clientY + 'px';
		this.item = map;
		this.contextMenu.menu.focusFirstItem('mouse');
		this.contextMenu.menu.hasBackdrop = false;
		this.contextMenu.openMenu();
	}

	// -----------------------------

	private getLog(data: any) {
		if (!data) { console.log("No hay logs para mostrar"); return; }

		if (!this.maps) { console.log("No hay mapas"); return; }

		let idx = this.maps.findIndex(map => map.id == data.id);
		if (idx < 0) {
			console.log("No se encontró el mapa con id: " + data.id);
			return;
		}

		let mapa = this.maps[idx];
		mapa.estado = "PROCESANDO";

		if (!mapa.log){
			mapa.log = [data.log];
		} else if (!mapa.log.includes(data.log)) {
			mapa.log.push(data.log);
		}
	}

	private finalizar(data: any) {
		if (!data) {
			console.log("NO HAY DATA");
			return;
		}
		// console.log(data);
		if (!this.maps) {
			console.log("MAPLIST ES NULL");
			return;
		}

		let idx = this.maps.findIndex(map => map.id == data.id);
		if (idx < 0) {
			console.log("No se encontró el mapa con id: " + data.id);
			return;
		}
		let mapa = this.maps[idx];

		// console.log(mapa);

		mapa.estado = data.error ? "ERROR" : "LISTO";
		if (!mapa.log)
			mapa.log = [data.log];
		else if (!mapa.log.includes(data.log))
			mapa.log.push(data.log);
		if (data.ext) mapa.ext = data.ext;
		// console.log(maps);
	}

	subirArchivo(event: any) {
		console.log({ event });
		if (!event.files) return;
		let files = event.files;
		const fileList = (files as FileList);
		const filenames: string[] = [];
		let fd = new FormData();

		for (let i = 0; i < fileList.length; i++) {
			const file = fileList.item(i);
			if (!file) continue;
			fd.append('file', file);
			filenames.push(file.name);
		}
		fd.append("socketId", this.mapWsService.socketId);

		let dialogRef = this.dialog.open(UploadFileOptionsComponent, {
			width: '500px',
			data: {
				filenames
			}
		});
		if (this.fileInput && this.fileInput.nativeElement) this.fileInput.nativeElement.value = '';
		dialogRef.afterClosed().subscribe(result => {
			if (!result) return;
			fd.append('opciones', result);
			this.mapsService.insertMaps(fd).subscribe((data: any) => {
				if (data) {
					this.mapsService.getMaps();

					// let mensaje = 'Se subió ' + data.maps.length + ' archivo/s correctamente. ';

					// if(data.errors.length > 0){
					// 	mensaje += data.errors.length + ' archivos fallaron al intentar subir.';
					// }
					let archivosLista: any[] = [];

					// Agrego los archivos que se subieron correctamente
					if (data.maps.length > 0) {
						data.maps.forEach((file: any) => {
							let obj = {
								name: file.name,
								done: true
							};
							archivosLista.push(obj);
						});
					}

					// Agrego los archivos que se subieron incorrectamente
					if (data.errors.length > 0) {
						data.errors.forEach((file: any) => {
							let obj = {
								name: file.name,
								done: false
							};
							archivosLista.push(obj);
						});
					}

					this._snackBar.openFromComponent(UploadingFileProgressComponent, {
						horizontalPosition: this.horizontalPosition,
						verticalPosition: this.verticalPosition,
						data: {
							cantidad: archivosLista.length,
							archivos: archivosLista,
						}
					});
					// this._snackBar.open(mensaje,'Aceptar');
					//mostrarErrores(data.errors);
				} else {
					this._snackBar.open('Se produjo un error al subir un archivo', 'Aceptar');
				}
			}, (error: any) => {
				console.log("Se produjo un error al subir archivos");
				console.error(error);
				this._snackBar.open('Error al subir el archivo', 'Aceptar');
			});
		});
	}

	openMap(map: MapData) {
		if (map) {
			let data = { 'map': map };
			let detailDialogConfig: MatDialogConfig = { data }
			let modal = this.dialog.open(MapVisualizerComponent, detailDialogConfig);

			modal.afterClosed().subscribe((closed: any) => {
				if (closed) {
					this.mapsService.closePreview(data.map.id)
				}
			});
		}
	}

	// -----------------------------
	// Metodos para opciones del menu contextual

	// Descarga un mapa (file)
	download() {
		this.mapsSectionService.download(this.selectedMaps);
	}

	// Elimina un mapa (file)
	async remove() {
		this.mapsSectionService.remove(this.selectedMaps);
		this.mapsService.getMaps();
	}

	// Muestra la vista detalle en la vista grilla
	openViewDetail(){
		this.gridView.openDetailView();
	}

}
