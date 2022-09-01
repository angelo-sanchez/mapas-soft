import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedMapManagerService {
  private selectedMaps : string[] = [] // Lista que contiene los mapas seleccionados por el usuario
  private dataSource$ = new BehaviorSubject(new Set<string>());
  private firstMap : string = ""; // Variable que almacena el primer elemento al que se le hizo click
  private firstMapSelected$ = new BehaviorSubject("");

  constructor() {}

  getSelectedMaps() : Observable<Set<string>>  {
    return this.dataSource$.asObservable();
  }

  getFirstSelected() : Observable<string>{
    return this.firstMapSelected$.asObservable();
  }

  isSelectedMapsEmpty() : boolean {
    if(this.selectedMaps.length > 0){
      return false;
    }
    return true;
  }

  selectWithClickCase(selectedMap : string) : void {
    if(selectedMap){
      this.selectedMaps = [selectedMap];
      this.firstMap = selectedMap;
    } else {
      this.selectedMaps = [];
      this.firstMap = "";
    }
    this.dataSource$.next(new Set(this.selectedMaps));
    this.firstMapSelected$.next(this.firstMap);
  }

  selectWithShiftCase(maps : string[], selectedMap : string) : void {
    let finalPositionMap = maps.findIndex((e : string) =>  e == selectedMap)
    
    if(!maps || maps.length == 0 || finalPositionMap == -1) { return; };

    if(this.isSelectedMapsEmpty()){
      this.selectedMaps = maps.slice(0, finalPositionMap + 1); 
    } else {
      let initialPositionMap : number = maps.findIndex((element : string) => element == this.firstMap ); // seleccion de der a izq

      if(initialPositionMap > finalPositionMap){      
        this.selectedMaps = maps.slice(finalPositionMap, initialPositionMap + 1); 
      } else {
        initialPositionMap  = maps.findIndex((element : string) => element == this.firstMap ); // seleccion de izq a der
        this.selectedMaps = maps.slice(initialPositionMap, finalPositionMap + 1);      
      }
    }
    this.dataSource$.next(new Set(this.selectedMaps));
  }

  selectWithCtrlCase(selectedMap : string) : void {
    if(!selectedMap) { return; }

    let sameMap = (map : string) => map == selectedMap;
    let index : number = this.selectedMaps.findIndex(sameMap);

    // Si el mapa a agregar ya se encuentra en el listado, lo elimino
    if(index !== -1){ 
      let arrayAux = this.selectedMaps.filter((map : string) => map != selectedMap);
      this.selectedMaps = arrayAux;
    } else {
      // Si el mapa a agregar no se encuentra en el listado, lo agrego
      this.selectedMaps.push(selectedMap);
    }

    this.dataSource$.next(new Set(this.selectedMaps));
  }

  resetSelectedMap() : void{
    this.selectedMaps = [];
    this.firstMap = "";
    this.dataSource$.next(new Set(this.selectedMaps));
    this.firstMapSelected$.next("");
  }

}
