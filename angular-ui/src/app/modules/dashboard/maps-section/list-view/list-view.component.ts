import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MapData } from '../../../models/map-data.model';
import { MapsSectionService } from '../maps-section-service'; 
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
  animations: [
		trigger('detailExpand', [
			state('collapsed', style({ display: 'none', height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*', display: 'block' })),
			transition('expanded <=> collapsed', animate('1ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class ListViewComponent implements OnInit {

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; 
  @ViewChild("fileUpload", {static : true }) fileInput!: ElementRef<HTMLInputElement>;

  @Input() public maps : MatTableDataSource<MapData> = new MatTableDataSource<MapData>();
  
  public item: MapData | null = null;
	public contextMenuPosition = { x: '0px', y: '0px' }; 
	public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
	public verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  public displayedColumns: string[] = ['name', 'owner', 'date_creation', 'loading'];
	public expandedElement: any;

  public isNombreAsc: boolean = true; // variable para boton de ordenamiento por columna nombre. Asc: true, Desc: false
	public isFechaAsc: boolean = true; // variable para boton de ordenamiento por columna fecha. Asc: true, Desc: false
    
  constructor(private mapsSectionService : MapsSectionService) {
    
  }

  ngOnInit(): void {
    console.log(this.maps);
  }

  // ordena las filas de la tabla (asc o desc), por el atributo 'nombre' o por 'fecha'
  sort(tipo: string, ord: string) {
		switch (tipo) {
			case 'nombre':
				if (ord === 'desc') {
					this.maps.data = this.maps.data.sort((one, two) => (one.name > two.name ? -1 : 1));
				} else {
					this.maps.data = this.maps.data.sort((one, two) => (one.name < two.name ? -1 : 1));
				}
				this.isNombreAsc = !this.isNombreAsc;
				break;
			case 'fecha':
				if (ord === 'desc') {
					this.maps.data = this.maps.data.sort((one, two) => (one.date_creation > two.date_creation ? -1 : 1));
				} else {
					this.maps.data = this.maps.data.sort((one, two) => (one.date_creation < two.date_creation ? -1 : 1));
				}
				this.isFechaAsc = !this.isFechaAsc;
				break;
		}
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
      console.log(this.contextMenu);
      if (this.contextMenu || this.contextMenu != undefined)
        this.contextMenu.closeMenu();
    }

  // Descarga un mapa (file)
  descargar(item: MapData | null) {
    if (item) {
      this.mapsSectionService.download(item).subscribe(data => {
        if (!data) {
          console.error("Error al descargar el archivo");
          return
        }

        let blob = new Blob([data], { type: "application/octet-stream" });

        fileSaver.saveAs(blob, item.name + '.mbtiles');
      }, error => console.error);
    } else {
      console.log("no hay item");
    }
  }

  // Elimina un mapa (file)
  eliminar(item: MapData | null) {
    if (item) this.mapsSectionService.deleteMaps([item.id]).subscribe(data => {
      this.maps.data = this.maps.data.filter(map => map.id != item.id);
    });
  }
}
