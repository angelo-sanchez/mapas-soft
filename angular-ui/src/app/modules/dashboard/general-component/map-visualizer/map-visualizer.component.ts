import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { MapsService } from 'src/app/modules/services/maps.service';
import { MapData } from 'src/app/modules/models/map-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-map-visualizer',
    templateUrl: './map-visualizer.component.html',
    styleUrls: ['./map-visualizer.component.css']
  })
  export class MapVisualizerComponent implements OnInit {

    // Variable boolean que se pone en TRUE cuando la url del mapa esta disponible
    public urlPreview : boolean = false;

    // Variable para el manejo de la dimesion del iframe
    public iframeWidth = "1250px";
    public iframeHeight = 1000;

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { map: any; },
      public dialogRef: MatDialogRef<MapVisualizerComponent>,
      private readonly sanitizer: DomSanitizer,
      private readonly mapsService: MapsService,
      private readonly snackbar: MatSnackBar,
      public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
      let map = this.data.map;

      if(map){
        this.openMap(map);
      } else {
        console.error("No hay mapa para visualizar : Map is Null");
        this.dialog.closeAll();
      }
    }

    openMap(map : MapData){
      this.mapsService.preview(map.id).subscribe((response: any) => {
        if (response && response.status == "STARTED") {
          let url = response.url;

          this.data.map.urlPreview = url;
          this.urlPreview = true;
        } else {
          this.data.map.urlPreview = '';
        }
      }, error => {
        console.error("Se produjo un error al ver la vista previa del mapa");
        console.log({error, message: error.message, msgError: error.error});
        if(error.error.includes("docker daemon is not running")){
          this.snackbar.open("El servicio de visualización de mapas no está disponible", "Cerrar");
        }
        this.dialog.closeAll();
      });
    }

}
