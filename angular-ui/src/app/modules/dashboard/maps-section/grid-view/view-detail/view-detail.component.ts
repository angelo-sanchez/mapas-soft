import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MapData } from 'src/app/modules/models/map-data.model';
import { SelectedMapManagerService } from '../../selected-map-manager.service';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css']
})
export class ViewDetailComponent implements OnInit {

  public maps : MapData[] = [];
  @Output() closeView = new EventEmitter<any>();

  constructor(private selectedMapManagerService : SelectedMapManagerService) { }

  ngOnInit(): void {
    this.selectedMapManagerService.getSelectedMaps().subscribe((data : MapData[]) => {
      this.maps = data;
    });
  }

  close(){
    this.closeView.emit();
  }

}
