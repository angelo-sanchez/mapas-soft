import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

// Componentes
import { DashboardComponent } from './dashboard.component';
import { MapListComponent } from './map-list/map-list.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SettingComponent } from './setting/setting.component';
import { DragDropComponent } from './general-component/drag-drop/drag-drop.component';
import { DragDropDirective } from './general-component/drag-drop/drag-drop.directive';
import { UploadingFileProgressComponent } from './general-component/uploading-file-progress/uploading-file-progress.component';


@NgModule({
  declarations: [
    MapListComponent,
    DashboardComponent,
    SidenavComponent,
    SettingComponent,
    DragDropComponent,
    DragDropDirective,
    UploadingFileProgressComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,

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
  ],
  exports:[
    DashboardComponent,
    MapListComponent,
    SidenavComponent,
    UploadingFileProgressComponent
  ]
})
export class DashboardModule { }
