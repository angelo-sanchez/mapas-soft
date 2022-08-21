import { Injectable } from '@angular/core';
import { MapData } from '../../models/map-data.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedMapManagerService {
  private selectedMaps : MapData[]; // Lista que contiene los mapas seleccionados por el usuario

  constructor() { 
    this.selectedMaps = [];
  }

  getSelectedMaps() : MapData[]{
    return this.selectedMaps;
  }

  isSelectedMapsEmpty() : boolean {
    if(this.selectedMaps.length > 0){
      return false;
    }
    return true;
  }

  selectWithClickCase(selectedMap : MapData) : void {
    if(selectedMap){
      this.selectedMaps = [selectedMap];
    } else {
      this.selectedMaps = [];
    }
  }

  selectWithShiftCase(maps : MapData[], selectedMap : MapData) : void {
    let finalPositionMap = maps.findIndex((e : MapData) =>  e.id == selectedMap.id )
    
    if(!maps || maps.length == 0 || !finalPositionMap) { return; };

    if(this.isSelectedMapsEmpty()){
      this.selectedMaps = maps.slice(0, finalPositionMap + 1); 
    } else {
      let posInitialMap : number = maps.findIndex((element : MapData) => element.id == this.selectedMaps[0].id );
      this.selectedMaps = maps.slice(posInitialMap, finalPositionMap + 1);      
    }
  }

  selectWithCtrlCase(selectedMap : MapData) : void {
    if(!selectedMap) { return; }

    let sameMap = (map : MapData) => map.id == selectedMap.id;
    let index : number = this.selectedMaps.findIndex(sameMap);

    // Si el mapa a agregar ya se encuentra en el listado, lo elimino
    if(index !== -1){ 
      let arrayAux = this.selectedMaps.filter((map) => map.id != selectedMap.id);
      this.selectedMaps = arrayAux;
      return; 
    }

    // Si el mapa a agregar no se encuentra en el listado, lo agrego
    this.selectedMaps.push(selectedMap);
  }

  resetSelectedMap() : void{
    this.selectedMaps = [];
  }
}
