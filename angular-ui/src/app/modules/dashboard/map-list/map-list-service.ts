import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

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

	constructor() {
	}

	getMaps(): Observable<any> {
		return of<Maps>(
			this.mapsInfo
		).pipe(
			tap((map) => {
				console.log(map);
			})
		);
	}
}

export type MapData = {
	id: string;
	name: string;
	date_creation: string;
	owner: string;
};
export type Maps = MapData[];
