import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

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

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

// Componentes 
import { AppComponent } from './app.component';
// import { SidenavComponent } from './modules/dashboard/sidenav/sidenav.component';
import { LoginComponent } from './modules/login/login.component';
// import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ErrorComponent } from './modules/error/error.component';
import { RegisterComponent } from './modules/register/register.component';
// import { MapListComponent } from './modules/dashboard/map-list/map-list.component';

// Servicios
import { LoginService } from './modules/login/login.service';
import { LoginGuardianService } from './modules/login/login-guardian.service';
import { MapListService } from './modules/dashboard/map-list/map-list-service';





@NgModule({
  declarations: [
    AppComponent,
    // SidenavComponent,
    LoginComponent,
    ErrorComponent,
    // DashboardComponent,
    RegisterComponent,
    // MapListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    ReactiveFormsModule,
    HttpClientModule,

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
  providers: [LoginService, LoginGuardianService, MapListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
