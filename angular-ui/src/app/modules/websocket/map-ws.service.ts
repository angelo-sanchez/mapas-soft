import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebsocketService } from './websocket.service';

export type MapMessage = {
  id: string;
  name: string;
  state: string;
  progress: string;
  message: string;
};

@Injectable({
  providedIn: 'root'
})
export class MapWsService {
 public messages: Subject<MapMessage>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<MapMessage>>wsService.connect(environment.wsUrl).lift<MapMessage>((response: MessageEvent) => {
      let data = JSON.parse(response.data);
      let msg: MapMessage = { ...data };
      return msg;
    });
  }

  public subirMapa(mapa: any) {
    this.messages.next(mapa);
  }

  public onData(callback: (message: MapMessage) => void): void {
    this.messages.subscribe(data => callback(data));
  }
}
