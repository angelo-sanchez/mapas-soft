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

// Componentes
import { DashboardComponent } from './dashboard.component';
import { MapListComponent } from './map-list/map-list.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SettingComponent } from './setting/setting.component';


@NgModule({
  declarations: [
    MapListComponent,
    DashboardComponent,
    SidenavComponent,
    SettingComponent
    
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
  ],
  exports:[
    DashboardComponent,
    MapListComponent,
    SidenavComponent
  ]
})
export class DashboardModule { }
