import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MapWsService {
  constructor(private socket: Socket) {
    socket.on("conectado", console.log);
  }

  onProgress() {
    return this.socket.fromEvent<{
      log: string,
      id: string
    }>("progress");
  }

  onFinish() {
    return this.socket.fromEvent<{
      log: string
      id: string,
      error: boolean
  }>("finish");
  }

}
