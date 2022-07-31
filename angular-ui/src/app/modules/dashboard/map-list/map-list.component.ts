import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MapData, MapListService } from '../map-list/map-list-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { UploadingFileProgressComponent } from '../general-component/uploading-file-progress/uploading-file-progress.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MapWsService } from '../../websocket/map-ws.service';
import { environment } from '../../../../environments/environment';
import * as fileSaver from 'file-saver';
import { UploadFileOptionsComponent } from '../general-component/upload-file-options/upload-file-options.component';
@Component({
	selector: 'app-map-list',
	templateUrl: './map-list.component.html',
	styleUrls: ['./map-list.component.css'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ display: 'none', height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*', display: 'block' })),
			transition('expanded <=> collapsed', animate('1ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class MapListComponent implements AfterViewInit {

	@ViewChild(MatMenuTrigger)
	contextMenu!: MatMenuTrigger;

	@ViewChild("fileUpload", {
		static: true
	}) fileInput!: ElementRef<HTMLInputElement>;

	contextMenuPosition = { x: '0px', y: '0px' };

	public mapList = new MatTableDataSource<MapData>();
	public displayedColumns: string[] = ['name', 'owner', 'date_creation', 'loading'];
	public expandedElement: any;

	public listado: boolean = true;
	public asc: boolean = true;
	public fechaAsc: boolean = true;
	public item: MapData | null = null;
	public urlBackend: string = environment.apiUrl;

	public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
	public verticalPosition: MatSnackBarVerticalPosition = 'bottom';

	public itemSeleccionado: any;
	public verVistaDetalle: boolean = false;

	public fileOptions: string = "";

	constructor(private mapListService: MapListService,
		private _snackBar: MatSnackBar,
		private mapWsService: MapWsService,
		private sanitizer: DomSanitizer,
		public dialog: MatDialog
	) {
	}
	ngAfterViewInit(): void {
		this.mapListService.getMaps().subscribe(maps => {
			this.mapList.data = maps;
			this.sort('nombre', 'asc');
			this.mapWsService.onProgress().subscribe((data) => this.mostrarLog(data));
			this.mapWsService.onFinish().subscribe((data) => this.finalizar(data));
		});
		console.log(this.fileInput);

	}

	abrirSnackBar() {
		let files = [{
			name: 'provincias.json',
			done: true
		},
		{
			name: 'municipios.json',
			done: false
		}];


		this._snackBar.openFromComponent(UploadingFileProgressComponent, {
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			data: {
				cantidad: 2,
				archivos: files,
			}
		});
	}

	private mostrarLog(data: any) {
		if (!data) {
			console.log("NO HAY DATA");
			return;
		}
		// console.log(data);
		if (!this.mapList) {
			console.log("MAPLIST ES NULL");
			return;
		}
		let maps = this.mapList.data;
		let idx = maps.findIndex(map => map.id == data.id);
		if (idx < 0) {
			console.log("No se encontró el mapa con id: " + data.id);
			return;
		}
		let mapa = maps[idx];

		mapa.estado = "PROCESANDO";
		if (!mapa.log)
			mapa.log = [data.log];
		else if (!mapa.log.includes(data.log))
			mapa.log.push(data.log);
		// console.log(maps);
		this.mapList.data = maps;
	}

	private finalizar(data: any) {
		if (!data) {
			console.log("NO HAY DATA");
			return;
		}
		// console.log(data);
		if (!this.mapList) {
			console.log("MAPLIST ES NULL");
			return;
		}

		let maps = this.mapList.data;
		let idx = maps.findIndex(map => map.id == data.id);
		if (idx < 0) {
			console.log("No se encontró el mapa con id: " + data.id);
			return;
		}
		let mapa = maps[idx];

		// console.log(mapa);

		mapa.estado = data.error ? "ERROR" : "LISTO";
		if (!mapa.log)
			mapa.log = [data.log];
		else if (!mapa.log.includes(data.log))
			mapa.log.push(data.log);
		if (data.ext) mapa.ext = data.ext;
		// console.log(maps);
		this.mapList.data = maps;
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
			this.mapListService.insertMaps(fd).subscribe((data: any) => {
				if (data) {
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
			}, error => {
				console.log("Se produjo un error al subir archivos");
				console.error(error);
				this._snackBar.open('Error al subir el archivo', 'Aceptar');
			});
		});
	}

	abrirModalOpcionesArchivos(): void {
		let dialogRef = this.dialog.open(UploadFileOptionsComponent, {
			width: '250px',
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log(result);
			this.fileOptions = result;
		});
	}

	@HostListener('document:contextmenu', ['$event', 'row'])
	onContextMenu(event: MouseEvent, map: MapData) {
		event.preventDefault();
		event.stopPropagation();
		this.contextMenu.closeMenu();
		if (!map) {
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
	onClick(event: MouseEvent) {
		if (this.contextMenu)
			this.contextMenu.closeMenu();
	}

	async loadPreview(map: any) {
		if (!this.expandedElement) {
			await this.mapListService.closePreview(map.id).toPromise();
			map.urlPreview = '';
			return;
		}
		this.mapListService.preview(map.id).subscribe((response: any) => {
			console.log("preview", response);
			if (response && response.status == "STARTED") {
				let url = response.url;
				if (environment.tileserverTrustedUrls.find((v) => url.startsWith(v)))
					url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
				map.urlPreview = url;
			} else map.urlPreview = '';
		}, error => console.error(error));
	}

	descargar(item: MapData | null) {
		if (item) {
			this.mapListService.download(item).subscribe(data => {
				if (!data) {
					console.error("Error al descargar el archivo");
					return;
				}

				let blob = new Blob([data], { type: "application/octet-stream" });

				fileSaver.saveAs(blob, item.name + '.mbtiles');
			}, error => console.error(error));
		} else {
			console.log("no hay item");
		}
	}

	eliminar(item: MapData | null) {
		if (item) this.mapListService.deleteMaps([item.id]).subscribe(data => {
			this.mapList.data = this.mapList.data.filter(map => map.id != item.id);
		});
	}

	sort(tipo: string, ord: string) {
		switch (tipo) {
			case 'nombre':
				if (ord === 'desc') {
					this.mapList.data = this.mapList.data.sort((one, two) => (one.name > two.name ? -1 : 1));
				} else {
					this.mapList.data = this.mapList.data.sort((one, two) => (one.name < two.name ? -1 : 1));
				}
				this.asc = !this.asc;
				break;
			case 'fecha':
				if (ord === 'desc') {
					this.mapList.data = this.mapList.data.sort((one, two) => (one.date_creation > two.date_creation ? -1 : 1));
				} else {
					this.mapList.data = this.mapList.data.sort((one, two) => (one.date_creation < two.date_creation ? -1 : 1));
				}
				this.fechaAsc = !this.fechaAsc;
				break;
		}

	}

	verDetalle(item: any) {
		this.itemSeleccionado = item;
		this.verVistaDetalle = true;
	}

	cerrarVistaDetalle() {
		this.verVistaDetalle = false;
		console.log('cerrando vista detalle');
	}


}