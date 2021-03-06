import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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

// Componentes
import { DashboardComponent } from './dashboard.component';
import { MapsSectionComponent } from './maps-section/maps-section.component';
import { MapsSectionModule } from './maps-section/maps-section.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SettingComponent } from './setting/setting.component';
import { DragDropComponent } from './general-component/drag-drop/drag-drop.component';
import { DragDropDirective } from './general-component/drag-drop/drag-drop.directive';
import { UploadingFileProgressComponent } from './general-component/uploading-file-progress/uploading-file-progress.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';
import { UploadFileOptionsComponent } from './general-component/upload-file-options/upload-file-options.component'; 


@NgModule({
  declarations: [
    MapsSectionComponent,
    DashboardComponent,
    SidenavComponent,
    SettingComponent,
    DragDropComponent,
    DragDropDirective,
    UploadingFileProgressComponent,
    ViewDetailComponent,
    UploadFileOptionsComponent ,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MapsSectionModule,
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
  exports:[
    DashboardComponent,
    MapsSectionComponent,
    SidenavComponent,
    UploadingFileProgressComponent,
    ViewDetailComponent,
    UploadFileOptionsComponent,
  ]
})
export class DashboardModule { }
