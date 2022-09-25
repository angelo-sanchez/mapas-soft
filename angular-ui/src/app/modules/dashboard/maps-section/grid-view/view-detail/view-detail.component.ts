import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css']
})
export class ViewDetailComponent implements OnInit {
  
  @Input() openViewDetail : any;
  // @Output() cerrar = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  close(){
    // this.cerrar.emit(true);
  }

}
