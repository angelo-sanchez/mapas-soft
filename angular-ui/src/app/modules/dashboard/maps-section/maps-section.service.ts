import { Injectable } from '@angular/core';
import { SelectedMapManagerService } from './selected-map-manager.service';
import * as fileSaver from 'file-saver';
import { MapsService } from '../../services/maps.service';
import { MapData } from '../../models/map-data.model';

@Injectable({
	providedIn: 'root'
})
export class MapsSectionService {
	constructor(private selectedMapsManager: SelectedMapManagerService,
		private mapsService : MapsService) {
	}

	// Elimina los mapas seleccionados
	remove(selectedMaps: MapData[]) {
		if (selectedMaps.length > 0) {
			let arr : string[] = [];
			selectedMaps.forEach(map => {
				arr.push(map.id)
			});
			this.mapsService.deleteMaps(arr).subscribe((data) => {
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
	download(selectedMaps: MapData[]) {
		if (selectedMaps.length > 0) {
			selectedMaps.forEach((map: MapData) => {
				this.mapsService.download(map.id).subscribe(data => {
					if (!data) {
						console.error("Error al descargar el archivo");
						return
					}
					let blob = new Blob([data], { type: "application/octet-stream" });
					fileSaver.saveAs(blob, map.name + '.mbtiles');
				}, error => {
					console.log(error);
				});
			});
		}
	}
}

