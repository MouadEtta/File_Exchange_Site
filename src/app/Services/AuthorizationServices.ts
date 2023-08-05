import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class AuthorizationService{  
  private apiUrl = 'https://localhost:16370/api'; 
  private accessToken!:string;
  private iduser!: any;
  private name!: any;
  private email!: any;
constructor(private http: HttpClient,public router: Router) {}

//COMPROBAR SOLICITUD HTTP DE CREDENCIAL A LA BASE DE DATOS-CHECK CREDENTIAL HTTP REQUEST TO  DATABASE
login(body:any) {
  const url=this.apiUrl;
  return this.http.post(url+"/login",body)
  .pipe(map((res: any) => {
    const decodedToken:any = jwt_decode(res.token)
    this.accessToken=res.token;
    this.iduser=decodedToken.userId;
    this.name=decodedToken.name;
    this.email=decodedToken.email;
  
  
    return res;
  }), catchError((err: any) => {
    return throwError(() => new Error (err));
  })
);
}
//AGREGAR SOLICITUD HTTP DE USUARIO A LA BASE DE DATOS-ADD USER HTTP REQUEST TO  DATABASE
signin(body:any) {
const url=this.apiUrl;
return this.http.post(url+"/signin",body) .pipe(map((res: any) => 
  {
    return res;
  }), 
  catchError((err: any) => 
  {
    return throwError(() => new Error (err));
  })
);
}
//COMPROBACIÓN DE LOS DATOS DEL FORMULARIO DE REGISTRO EN LA BASE DE DATOS SOLICITUD HTTTP A LA BASE DE DATOS-CHECKING SIGN IN FORM DATA  IN THE DATABASE HTTTP REQUEST TO DATABASE
checkUser(body:any) {
const url=this.apiUrl;
return this.http.post(url+"/checkUser",body).pipe(map((res: any) => 
  {
    return res;
  }), 
  catchError((err: any) => 
  {
    return throwError(() => new Error (err));
  })
);
}
//ELIMINACIÓN DE DATOS DE USUARIO-DELETING DATA USER
logout() {
  this.accessToken = '';
  localStorage.removeItem('key');
  this.iduser = null;
  this.name = null;
  this.email = null;
  this.router.navigate(['/login']);
}
//GUARDANDO DATOS DE USUARIO-SAVING USER DATA
loginData(body:any){
  this.accessToken = body.token;
  this.iduser =body.id;
  this.name = body.name;
  this.email = body.email;
}
//OBTENER TODOS LOS USUARIOS-GETTING ALL THE USERS
getUsers(){
  let url =this.apiUrl;
    return this.http.get<any[]>(url+"/getusers")
      .pipe(map((res: any) => {
        return res;
      }), catchError((err: any) => {
        return throwError(() => new Error (err));
      })
    );
}
//OBTENCIÓN DE TOKEN, DNI, NOMBRE Y CORREO ELECTRÓNICO-GET OF TOKEN,ID,NAME AND EMAIL
getToken(){
  return this.accessToken;

}
getId(){
  return this.iduser;
  
}
getName(){
  return this.name;
  
}
getEmail(){
  return this.email;
  
}
}