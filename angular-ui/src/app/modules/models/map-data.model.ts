export type MapData = {
	id: string;
	name: string;
	date_creation: string;
	owner: string;
	estado?: string;
	log?: string[];
	ext: string;
};
export type Maps = MapData[];