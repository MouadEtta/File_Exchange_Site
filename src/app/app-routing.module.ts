import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { AuthGuard } from './Services/auth_guard/auth.guard';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
   {path: '',redirectTo: 'login',pathMatch: 'full'}, 
  {path: 'login',component:LoginComponent},
  {path: 'signin', component:SignInComponent},
  {path: 'MainPage', component:MainpageComponent,  canActivate: [ AuthGuard ]},
  {path: 'charts',component:ChartsComponent,canActivate: [ AuthGuard ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
