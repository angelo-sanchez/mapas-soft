import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class MapListService {
	mapsInfo: Maps = [
		{
			id: '1',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '2',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		}
	];

	constructor(private httpClient: HttpClient) {
	}

	getMaps(): Observable<any> {
		let url = environment.apiUrl + "/maps";
		return this.httpClient.get<MapData>(url);
	}
}

export type MapData = {
	id: string;
	name: string;
	date_creation: string;
	owner: string;
};
export type Maps = MapData[];
