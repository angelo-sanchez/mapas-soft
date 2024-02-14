import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs' ;

import { MapData } from '../../../models/map-data.model';

import { SelectedMapManagerService } from '../selected-map-manager.service';
import { MapSort } from '../maps-section.component';

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
  @Input() public sorting!: MapSort;
  @Output() public sort = new EventEmitter<{ active: keyof MapData, direction: 'asc'|'desc' }>();
  @Output() public onClick = new EventEmitter();
  @Output() public onContextMenu = new EventEmitter();
  @Output() public onDblClick = new EventEmitter();

  // Subcripcion a la lista de MapData
  private subscriptionMaps : Subscription = new Subscription;

  // Subcripcion a la lista de MapData seleccionados
  private subscriptionMapSelected : Subscription = new Subscription;

  // Set que contiene los mapas seleccionados
  public selectedMaps: MapData[] = [];

  // String que contiene el id del primer mapa seleccionado
  public firstSelectedMap: string = "";

  public displayedColumns: string[] = ['name', 'owner', 'date_creation', 'loading'];
  public expandedElement: any;

  constructor(private selectedMapManager : SelectedMapManagerService,
    private cdRef: ChangeDetectorRef) {
  }

  toggleExpanded(map: MapData): void {
    this.expandedElement = this.expandedElement === map ? null : map;
  }

  // Click izquierdo - Seleccion de mapas
  @HostListener('click', ['$event', 'map'])
  click(event: MouseEvent, map: MapData) {
    let res: boolean = false;
    let paths: any[] = event.composedPath();

    for (const path of paths) {
      if (path.tagName === "BODY") { break; }
      if (path.classList.contains("example-element-row")) {
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
    this.subscriptionMaps = this.selectedMapManager.getSelectedMaps().subscribe((data) => {
      this.selectedMaps = data;
      this.cdRef.markForCheck();
    });

    this.subscriptionMapSelected = this.selectedMapManager.getFirstSelected().subscribe((data: any) => {
      this.firstSelectedMap = data?.id ?? '';
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscriptionMaps.unsubscribe();
    this.subscriptionMapSelected.unsubscribe();
  }

  reportSortChange(e:any, active: keyof MapData) {
    e.preventDefault();
    const activeChanged = active !== this.sorting.active;
    const direction = activeChanged || this.sorting.direction === 'desc' ? 'asc' : 'desc';
    this.sort.emit({ active: active, direction: direction});
  }

  reportClickEvent(event: MouseEvent, map: MapData) {
    let data = {
      "event": event,
      "map": map
    };
    this.onClick.emit(data);
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
