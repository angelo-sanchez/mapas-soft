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
		},
		{
			id: '3',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '4',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '5',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '6',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '7',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '8',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '9',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '10',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '11',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '12',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
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
		},
		{
			id: '3',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '4',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '5',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '6',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '7',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '8',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '9',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '10',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '11',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '12',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
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
		},
		{
			id: '3',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '4',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '5',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '6',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '7',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '8',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '9',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '10',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
		{
			id: '11',
			name: 'Map 1',
			date_creation: '2021-08-07',
			owner: 'you'
		},
		{
			id: '12',
			name: 'Map 2',
			date_creation: '2021-08-06',
			owner: 'you'
		},
	];

	constructor(private httpClient: HttpClient) {
	}

	getMaps(): Observable<Maps>{
		// let url = environment.apiUrl + "/maps";
		// return this.httpClient.get<MapData>(url);
		return of<Maps>(
			this.mapsInfo
		).pipe(
			tap((map) => {
				console.log(map);
			})
		);
	}

	insertMaps(datos : any){
		let url = environment.apiUrl + '/insert'
		return this.httpClient.post(url,'');
	}

	deleteMaps(){
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
