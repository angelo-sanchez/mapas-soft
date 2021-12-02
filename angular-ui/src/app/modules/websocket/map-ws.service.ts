import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MapWsService {
  public socketId: string;
  constructor(private socket: Socket) {
    this.socketId = '';
    socket.on("conectado", (data:any) => {
      this.socketId = data.id;
      console.log(data);
    });
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
