import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridViewComponent } from './grid-view/grid-view.component';  
import { ListViewComponent } from './list-view/list-view.component';

@NgModule({
  declarations: [
    ListViewComponent,
    GridViewComponent
  ],
  imports: [
    CommonModule,
  ], 
  exports: [
    ListViewComponent,
    GridViewComponent
  ]
})
export class MapsSectionModule { }
