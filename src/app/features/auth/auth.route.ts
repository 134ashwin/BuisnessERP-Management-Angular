//This File Contains the separate Routing Logic for the Entire Auth Part 
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const auth_routes: Routes = [
   {
    path: 'login',
    component: LoginComponent
  },
];