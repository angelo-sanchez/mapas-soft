import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../login/login.service';

@Injectable({
	providedIn: 'root'
})
export class MapListService {
	constructor(private httpClient: HttpClient,
		private loginService: LoginService) {
	}

	getMaps(): Observable<Maps> {
		let url = environment.apiUrl + "/maps";
		return this.httpClient.get<Maps>(url, {
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken()
			}
		});
	}

	insertMaps(datos: FormData) {
		let url = environment.apiUrl + '/maps'
		return this.httpClient.post<any>(url, datos, {
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken()
			}
		});
	}

	deleteMaps() {
		// insertar logica
	}
}

export type MapData = {
	id: string;
	name: string;
	date_creation: string;
	owner: string;
};
export type Maps = MapData[];
