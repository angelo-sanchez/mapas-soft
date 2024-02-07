import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs' ;

import { MatTableDataSource } from '@angular/material/table';
import { MapData } from '../../../models/map-data.model';

import { SelectedMapManagerService } from '../selected-map-manager.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ display: 'none', height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', display: 'block' })),
      transition('expanded <=> collapsed', animate('1ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListViewComponent implements OnInit {

  @ViewChild("fileUpload", { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  @Input() public maps : MapData[] = []; 
  public mapsDS : MatTableDataSource<MapData> = new MatTableDataSource<MapData>(); 

  @Output() public onClick = new EventEmitter();
  @Output() public onContextMenu = new EventEmitter();
  @Output() public onDblClick = new EventEmitter();

  // Subcripcion a la lista de MapData
  private subscriptionMaps : Subscription = new Subscription; 
  
  // Subcripcion a la lista de MapData seleccionados
  private subscriptionMapSelected : Subscription = new Subscription;
  
  // Arreglo que contiene los id de @Input() maps
  public mapsId: string[] = []; 

  // Set que contiene los mapas seleccionados
  public selectedMaps: Set<string> = new Set<string>(""); 

  // String que contiene el id del primer mapa seleccionado
  public firstSelectedMap: string = "";


  public displayedColumns: string[] = ['name', 'owner', 'date_creation', 'loading'];
  public expandedElement: any;

  public isNombreAsc: boolean = true; // variable para boton de ordenamiento por columna nombre. Asc: true, Desc: false
  public isFechaAsc: boolean = true; // variable para boton de ordenamiento por columna fecha. Asc: true, Desc: false

  constructor(private selectedMapManager : SelectedMapManagerService,
    private cdRef: ChangeDetectorRef) {
  }

  // Click izquierdo - Seleccion de mapas
  @HostListener('click', ['$event', 'map'])
  click(event: MouseEvent, map: MapData) {  
    let res: boolean = false;
    let paths: any[] = event.composedPath();

    for (const path of paths) {
      if (path.tagName === "BODY") { break; }
      if (path.classList.contains("container-file")) {
        res = true;
        break;
      }
    } 
    if (res && map === undefined) { return; }

    this.reportClickEvent(event, map);
  }

  // Click derecho - Abrir menu contextual
  @HostListener('contextmenu', ['$event', 'row'])
  contextMenu(event: MouseEvent, map: MapData) {
    event.preventDefault();
    event.stopPropagation();  
    if (!map) { return; }  

    this.reportContextMenuEvent(event, map);
  }

  ngOnInit(): void {
    this.mapsDS = new MatTableDataSource<MapData>(this.maps);

    this.subscriptionMaps = this.selectedMapManager.getSelectedMaps().subscribe((data: any) => {
      this.selectedMaps = data;
      this.cdRef.markForCheck();
    });

    this.subscriptionMapSelected = this.selectedMapManager.getFirstSelected().subscribe((data: any) => {
      this.firstSelectedMap = data;
      this.cdRef.markForCheck();
    });
  }
  
  ngOnDestroy() {
    this.subscriptionMaps.unsubscribe();
    this.subscriptionMapSelected.unsubscribe();
  }

  // ordena las filas de la tabla (asc o desc), por el atributo 'nombre' o por 'fecha'
  sort(tipo: string, ord: string) {
    switch (tipo) {
      case 'nombre':
        if (ord === 'desc') {
          this.mapsDS.data = this.mapsDS.data.sort((one, two) => (one.name > two.name ? -1 : 1));
        } else {
          this.mapsDS.data = this.mapsDS.data.sort((one, two) => (one.name < two.name ? -1 : 1));
        }
        this.isNombreAsc = !this.isNombreAsc;
        break;
      case 'fecha':
        if (ord === 'desc') {
          this.mapsDS.data = this.mapsDS.data.sort((one, two) => (one.date_creation > two.date_creation ? -1 : 1));
        } else {
          this.mapsDS.data = this.mapsDS.data.sort((one, two) => (one.date_creation < two.date_creation ? -1 : 1));
        }
        this.isFechaAsc = !this.isFechaAsc;
        break;
    }
  }

  reportClickEvent(event: MouseEvent, map: MapData) {
    let data = {
      "event": event,
      "map": map
    };
    this.onClick.emit(data);
  }
    // Inspeccionar mapa
  inspeccionar(item: MapData | null) {
    if (item) {
      const data = { map: item };
      const detailDialogConfig: MatDialogConfig = {
        data
      }
      this.dialog.open(MapVisualizerComponent, detailDialogConfig).afterClosed().subscribe(
				(closed) => {
					if (closed) {
						this.mapsSectionService.closePreview(data.map.id)
					}
			)
				}
    }
  }

  reportContextMenuEvent(event: MouseEvent, map: MapData) {
    let data = {
      "event": event,
      "map": map
    };
    this.onContextMenu.emit(data);
  }

  dblClickEvent(map : MapData) {
    this.onDblClick.emit(map);
  }
}
