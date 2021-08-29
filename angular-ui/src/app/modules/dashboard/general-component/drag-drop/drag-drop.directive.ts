import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @HostBinding('class.fileover') fileOver: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();

  constructor() { }

  // Dragover listener
  @HostListener('dragover',['$event']) onDragOver(evt : any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

   // Dragleave listener
   @HostListener('dragleave', ['$event']) public onDragLeave(evt : any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop',['$event']) ondrop(evt : any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    console.log(evt.dataTransfer.files)

    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
  
}
