import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css']
})
export class ViewDetailComponent implements OnInit {
  
  @Input() openViewDetail : any;
  @Output() closeView = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  close(){
    this.closeView.emit();
  }

}
