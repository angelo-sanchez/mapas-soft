import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapData } from '../../models/map-data.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedMapManagerService {
  private selectedMaps : MapData[] = [] // Lista que contiene los mapas seleccionados por el usuario
  private dataSource$ = new BehaviorSubject<MapData[]>([]);
  private firstMap : any; // Variable que almacena el primer elemento al que se le hizo click
  private firstMapSelected$ = new BehaviorSubject({});

  getSelectedMaps() {
    return this.dataSource$.asObservable();
  }

  isSelected(map: MapData) {
    return this.dataSource$.value.includes(map);
  }

  getFirstSelected() {
    return this.firstMapSelected$.asObservable();
  }

  isSelectedMapsEmpty() : boolean {
    return this.selectedMaps.length < 1;
  }

  selectWithClickCase(selectedMap : MapData) : void {
    if(selectedMap){
      this.selectedMaps = [selectedMap];
      this.firstMap = selectedMap;
    } else {
      this.selectedMaps = [];
      this.firstMap = null;
    }
    this.dataSource$.next(this.selectedMaps);
    this.firstMapSelected$.next(this.firstMap);
  }

  selectWithShiftCase(maps : MapData[], selectedMap : MapData) : void {
    let finalPositionMap = maps.findIndex((e : MapData) =>  e.id == selectedMap.id)

    if(!maps || maps.length == 0 || finalPositionMap == -1) { return; };

    if(this.isSelectedMapsEmpty()){
      this.selectedMaps = maps.slice(0, finalPositionMap + 1);
    } else {
      let initialPositionMap : number = maps.findIndex((element : MapData) => element.id == this.firstMap.id ); // seleccion de der a izq

      if(initialPositionMap > finalPositionMap){
        this.selectedMaps = maps.slice(finalPositionMap, initialPositionMap + 1);
      } else {
        initialPositionMap  = maps.findIndex((element : MapData) => element.id == this.firstMap.id ); // seleccion de izq a der
        this.selectedMaps = maps.slice(initialPositionMap, finalPositionMap + 1);
      }
    }
    this.dataSource$.next(this.selectedMaps);
  }

  selectWithCtrlCase(selectedMap : MapData) : void {
    if(!selectedMap) { return; }

    let sameMap = (map : MapData) => map.id == selectedMap.id;
    let index : number = this.selectedMaps.findIndex(sameMap);

    // Si el mapa a agregar ya se encuentra en el listado, lo elimino
    if(index !== -1){
      let arrayAux = this.selectedMaps.filter((map : MapData) => map.id != selectedMap.id);
      this.selectedMaps = arrayAux;
    } else {
      // Si el mapa a agregar no se encuentra en el listado, lo agrego
      this.selectedMaps.push(selectedMap);
    }

    this.dataSource$.next(this.selectedMaps);
  }

  resetSelectedMap() : void{
    this.selectedMaps = [];
    this.firstMap = null;
    this.dataSource$.next(this.selectedMaps);
    this.firstMapSelected$.next(this.firstMap);
  }

}
