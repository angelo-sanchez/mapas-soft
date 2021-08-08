import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { ErrorComponent } from './modules/error/error.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginGuardianService } from './modules/login/login-guardian.service';
import { MapListComponent } from './modules/dashboard/map-list/map-list.component';
import { SettingComponent } from './modules/dashboard/setting/setting.component';



const routes: Routes = [
  {path: '',component: DashboardComponent, canActivate : [LoginGuardianService], children : [
      {path: 'maps', component: MapListComponent},
      {path: 'setting', component: SettingComponent}
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
