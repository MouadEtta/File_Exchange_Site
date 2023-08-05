import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class LogService{ 
    private apiUrl = 'https://localhost:16370/api'; 
    constructor(private http: HttpClient,private MessageService:MessageService) {};


//OBTENER SOLICITUD HTTP DE ARCHIVO LOGS-GET LOGS HTTP REQUEST TO  DATABASE
getLogs(){
    let url =this.apiUrl;
    return this.http.get<any[]>(url+"/logs")
      .pipe(map((res: any) => {
        return res;
      }), catchError((err: any) => {
        return throwError(() => new Error (err));
      })
    );
  }






}
