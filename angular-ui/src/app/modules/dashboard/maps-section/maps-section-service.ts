import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../login/login.service';
import { MapData, Maps } from '../../models/map-data.model';

@Injectable({
	providedIn: 'root'
})
export class MapsSectionService {
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
		let url = environment.apiUrl + '/maps';
		return this.httpClient.post<any>(url, datos, {
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken()
			}
		});
	}

	download(item: MapData) {
		let url = environment.apiUrl + "/maps/download/" + item.id;
		return this.httpClient.get(url, {
			responseType: 'blob',
			headers: {
				'Authorization': `bearer ` + this.loginService.getToken(),
				'Accept': "application/octet-stream"
			}
		});
	}

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


