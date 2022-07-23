import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridViewComponent } from './grid-view/grid-view.component';  
import { ListViewComponent } from './list-view/list-view.component';

// Coponentes angular-material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ListViewComponent,
    GridViewComponent
  ],
  imports: [
    CommonModule,
    // Material angular
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ], 
  exports: [
    ListViewComponent,
    GridViewComponent
  ]
})
export class MapsSectionModule { }
