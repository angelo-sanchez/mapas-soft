import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapData, Maps } from '../models/map-data.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';

@Injectable({
	providedIn: 'root'
})
export class MapsService {

	// Observable que contiene los mapas del usuario
	private dataSource$ = new BehaviorSubject<MapData[]>([]);

	constructor(private httpClient: HttpClient,
		private loginService: LoginService) { }

	public mapSubscription(): Observable<MapData[]> {
		return this.dataSource$.asObservable();
	}

	// Obtiene los mapas del usuario. Retorna MapData[]
	async getMaps() {
		let url = environment.apiUrl + "/maps";
		let maps: MapData[] = await this.httpClient.get<MapData[]>(url, {
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken()
			}
		}).toPromise();

		this.dataSource$.next(maps);
	}

	// Inserta un mapa. Retorna un MapData
	insertMaps(datos: FormData) {
		let url = environment.apiUrl + '/maps'
		return this.httpClient.post<any>(url, datos, {
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken()
			}
		});
	}

	// Descarga un mapa. Retorna un Blob
	download(mapId: string) {
		let url = environment.apiUrl + "/maps/download/" + mapId;
		return this.httpClient.get(url, {
			responseType: 'blob',
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken(),
				'Accept': "application/octet-stream"
			}
		});
	}

	// Elimina un mapa. Retorna un json. {success, error}. success contiene string[] (ids)
	deleteMaps(ids: string[]) {
		let url = environment.apiUrl + '/maps?id=' + encodeURIComponent(JSON.stringify(ids));
		return this.httpClient.delete<any>(url, {
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken()
			}
		});
	}

	preview(id: string) {
		return this.httpClient.get(`${environment.apiUrl}/maps/${id}/preview`, {
			headers: {
				'Authorization': `bearer ${this.loginService.getToken()}`
			}
		});
	}

	closePreview(id: string) {
		return this.httpClient.get(`${environment.apiUrl}/maps/${id}/close`, {
			headers: {
				'Authorization': `bearer ${this.loginService.getToken()}`
			}
		});
	}

}
