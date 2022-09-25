import { Injectable } from '@angular/core';
import { SelectedMapManagerService } from './selected-map-manager.service';
import * as fileSaver from 'file-saver';
import { MapsService } from '../../services/maps.service';


@Injectable({
	providedIn: 'root'
})
export class MapsSectionService {

	// True: Muestra la vista detalle; False: Oculta la vista detalle
	private viewDetailsActive : boolean = false;

	constructor(private selectedMapsManager: SelectedMapManagerService,
		private mapsService : MapsService) {
	}

	setViewDetails(){
		this.viewDetailsActive = !this.viewDetailsActive;
	}

	// Elimina los mapas seleccionados
	remove(selectedMaps: string[]) {
		if (selectedMaps.length > 0) {
			this.mapsService.deleteMaps(selectedMaps).subscribe((data) => {
				if (data.success) {
					this.selectedMapsManager.resetSelectedMap();
					this.mapsService.getMaps();
				}
			}, (error) => {
				console.log("Se produjo un error al intentar eliminar mapas");
				console.log(error);
			});
		}
	}

	// Descarga un mapa (file)
	download(selectedMaps: string[]) {
		if (selectedMaps.length > 0) {
			selectedMaps.forEach((mapId: string) => {
				this.mapsService.download(mapId).subscribe(data => {
					if (!data) {
						console.error("Error al descargar el archivo");
						return
					}
					let blob = new Blob([data], { type: "application/octet-stream" });
					fileSaver.saveAs(blob, mapId + '.mbtiles');
				}, error => {
					console.log(error);
				});
			});
		}
	}
}

