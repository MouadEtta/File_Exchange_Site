import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';


@Injectable()
export class AuthGuard  {
  constructor(private router: Router) {}
//BUSCANDO SI EN EL ALMACENAMIENTO LOCAL HAY TOKEN Y SI NO ENVIANDO AL USUARIO A LA PÁGINA DE LOGIN-
//SEARCHING IF IN THE LOCAL STORAGE THERE IS A TOKEN AND IF NOT SENDING THE USER TO THE LOGIN PAGE
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token:any = localStorage.getItem('key');
    if (state.url.includes('MainPage')) {
      if (token) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
    //COMPRUEBE SI LA ID EN EL TOKEN ES DEL ADMINISTRADOR SI NO ENVÍA AL USUARIO A LA PÁGINA DE LOGIN
    //CHECK IF THE ID IN THE TOKEN IS OF THE ADMINISTRATOR IF NOT SENDING THE USER TO THE LOGIN PAGE
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const id = decodedToken.userId;
      if(id==28){
        return true;
      }
      else{
        this.router.navigate(['/MainPage'],{state:token});
      return false;
      }
      
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
}


