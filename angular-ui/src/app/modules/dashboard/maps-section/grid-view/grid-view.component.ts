
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapData } from '../../../models/map-data.model';
import { SelectedMapManagerService } from '../selected-map-manager.service';


@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridViewComponent implements OnInit, OnDestroy {

  @Input() public maps: MapData[] = [];
  
  @Output() public onClickEvent = new EventEmitter();
  @Output() public contextMenuEvent = new EventEmitter();
  @Output() public dblClickEvent = new EventEmitter();

  private subscriptionMaps: Subscription = new Subscription;
  private subscriptionMapSelected: Subscription = new Subscription;

  public mapsId: string[] = []; // Arreglo que contiene los id de @Input() maps
  public selectedMaps: Set<string> = new Set<string>(""); // Set que contiene los mapas seleccionados
  public firstSelectedMap: string = "";


  constructor(
    private selectedMapManager: SelectedMapManagerService,
    private cdRef: ChangeDetectorRef
  ) { }

  // --------------------------------------------------

  // Click izquierdo - Seleccion de mapas
  @HostListener('click', ['$event', 'map'])
  onClick(event: MouseEvent, map: MapData) {  
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
  onContextMenu(event: MouseEvent, map: MapData) {
    event.preventDefault();
    event.stopPropagation();  
    if (!map) { return; }  

    this.reportContextMenuEvent(event, map);
  }

  // --------------------------------------------------

  ngOnInit(): void {
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

  reportClickEvent(event: MouseEvent, map: MapData) {
    let data = {
      "event": event,
      "map": map
    };
    this.onClickEvent.emit(data);
  }

  reportContextMenuEvent(event: MouseEvent, map: MapData) {
    let data = {
      "event": event,
      "map": map
    };
    this.contextMenuEvent.emit(data);
  }

  onDblClickEvent(map : MapData) {
    this.dblClickEvent.emit(map);
  }
}
