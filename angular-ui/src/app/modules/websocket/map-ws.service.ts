import { Injectable, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';

@Injectable({
  providedIn: 'root'
})
export class MapWsService extends Socket{

  outEven: EventEmitter<any> = new EventEmitter();

  constructor() {
   super({
     url:'http://localhost:3000',
   })
   this.listenProgress()
   this.listenFinish()
  }  

  listenProgress = () => {
    this.ioSocket.on('progress', (res: any) => this.outEven.emit(res))
  }

  listenFinish = () => {
    this.ioSocket.on('finish', (res: any) => this.outEven.emit(res))
  }

  emitEvent = (payload = {}) => {
    this.ioSocket.emit('event', payload)
  }
}
