import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { ErrorComponent } from './error/error.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginGuardianService } from './login/login-guardian.service';

const routes: Routes = [
  {path: '',component: DashboardComponent, canActivate : [LoginGuardianService]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SigninComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
