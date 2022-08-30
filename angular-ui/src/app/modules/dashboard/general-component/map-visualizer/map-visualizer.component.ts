import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsSectionService } from '../../maps-section/maps-section-service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-map-visualizer',
    templateUrl: './map-visualizer.component.html',
    styleUrls: ['./map-visualizer.component.css']
  })
  export class MapVisualizerComponent implements OnInit {

    urlPreview: any = false;

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { map: any; },
      public dialogRef: MatDialogRef<MapVisualizerComponent>,
      private readonly sanitizer: DomSanitizer,
      private readonly mapSectionService: MapsSectionService,
    ) {
    }
  
    ngOnInit(): void {
      console.log('entro al')
      this.mapSectionService.preview(this.data.map.id).subscribe((response: any) => {
        console.log("preview", response);
        if (response && response.status == "STARTED") {
          let url = response.url;
          if (environment.tileserverTrustedUrls.find((v) => url.startsWith(v)))
            url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.data.map.urlPreview = url;
          this.urlPreview = true
        } else this.data.map.urlPreview = '';
      }, error => console.error(error));
    }

    //async loadPreview() {
	//if (!this.expandedElement) {
		//	await this.mapSectionService.closePreview(this.data.map.id).toPromise();
		//	this.data.map.urlPreview = '';
		//	return;
		//}
	//}
}