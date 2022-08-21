import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MapData } from '../../../models/map-data.model';
import { SelectedMapManagerService } from '../selected-map-manager.service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css']
})
export class GridViewComponent implements OnInit {

  @Input() public maps : MapData[] = []; 

  constructor(
    private selectedMapManager : SelectedMapManagerService
  ) { }

  @HostListener('click', ['$event', 'row'])
    onClick(event: MouseEvent, map: MapData) {
      if(!map){ return; }

      if(event.shiftKey){
        this.selectedMapManager.selectWithShiftCase(this.maps,map);
      } else if(event.ctrlKey){
        this.selectedMapManager.selectWithCtrlCase(map);
      } else {
        this.selectedMapManager.selectWithClickCase(map);
      }
    }

  ngOnInit(): void {

  }

}
