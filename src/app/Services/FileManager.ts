import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class FileManager{ 
    private apiUrl = 'https://localhost:16370/api'; 
    constructor(private http: HttpClient,private MessageService:MessageService) {}
//CARGAR SOLICITUD HTTP DE ARCHIVO A LA BASE DE DATOS-UPLOAD FILE HTTP REQUEST TO  DATABASE
    upload(body:any) {
        const url=this.apiUrl;
      return this.http.post(url+"/mainpage",body)
        .pipe(map((res: any) => {
          return res;
        }), catchError((err: any) => {
          return throwError(() => new Error (err));
        })
      );
      }
//OBTENER SOLICITUD HTTP DE ARCHIVO A LA BASE DE DATOS-GET FILE HTTP REQUEST TO  DATABASE
      getfiles(){
        let url =this.apiUrl;
        return this.http.get<any[]>(url+"/files")
          .pipe(map((res: any) => {
            return res;
          }), catchError((err: any) => {
            return throwError(() => new Error (err));
          })
        );
      }
//ELIMINAR SOLICITUD HTTP DE ARCHIVO A LA BASE DE DATOS-DELETE FILE HTTP REQUEST TO  DATABASE
      deleteFile(body:any){
        return this.http.post(this.apiUrl+"/delete",body)
          .pipe(map((res: any) => {
            return res;
          }), catchError((err: any) => {
            this.MessageService.add({ severity: 'error', summary: 'Error del Servidor', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });
            return throwError(() => new Error (err));
          })
        );
      } 
//DESCARGAR ARCHIVO SOLICITUD HTTP A LA BASE DE DATOS-DOWNLOAD FILE HTTP REQUEST TO  DATABASE
downloadFile(body: any): Observable<Blob> {
  let url = this.apiUrl;
  return this.http.post(url + '/download', body, {
    responseType: 'blob'
  }).pipe(map((res: any) => {
    return res;}),
    catchError((error: any) => {
      return throwError(() => new Error(error));
    })
  );
}
//ENVIAR LOG A LA BASE DATOS-SENDING LOG TO DB
sendLog(body: any){
  let url = this.apiUrl;
  return this.http.post(url + '/sendlog', body).pipe(map((res: any) => 
  {
    return res;
  }),
    catchError((error: any) => 
    {
      return throwError(() => new Error(error));
    })
  );
}
//SOLICITUD HTTP PARA ENVIAR UN CORREO ELECTRÓNICO-HTTP REQUEST TO SENT AN EMAIL
sendEmail(body: any){
  let url = this.apiUrl;
  return this.http.post(url + '/sendemail', body).pipe(map((res: any) => 
  {
    return res;
  }),
    catchError((error: any) => 
    {
      return throwError(() => new Error(error));
    })
  );
}
   } 
