
import { Component, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../Services/AuthorizationServices';
import { MessageService} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signinForm!: FormGroup;
  showDialog: boolean = false;
   //BOTTON DE LOGIN-LOGIN BUTTON 
   disable: boolean = false;
   isLoading: boolean= false;

   constructor(public router: Router,private _authsr: AuthorizationService, private MessageService:MessageService,private dialogService: DialogService){}
   ref: DynamicDialogRef | undefined;

   ngOnInit(){
    this.getDataSigninForm();
   }
   //OBTENCIÓN DE DATOS PARA EL FORMULARIO DE REGISTRO-GETTING DATA FOR SIGNIN FORM
      getDataSigninForm(){
      this.signinForm = new FormGroup({
     
        Username: new FormControl('', Validators.required),
        Email: new FormControl('', Validators.required),
        Password: new FormControl('', Validators.required),
      })
    }


   //COMPROBANDO DESDE LA BASE DE DATOS SI YA TENEMOS-CHECKING FROM THE DATABASE IF WE ALREADY HAVE
   //EL NOMBRE DE USUARIO O CORREO ELECTRÓNICO DEL FORMULARIO DE REGISTRO-THE USERNAME OR EMAIL ADDRESS OF THE REGISTRATION FORM
    checkUser(){
      const user = this.signinForm.value;
      this._authsr.checkUser(user)
        .subscribe({
          next: (response: any) => 
          {
            if (response.success) 
            {
              this.addUser();
             } else 
             {
                const dbuser=response.userid;
          
                if(dbuser[0].username===user.Username)
                {
                  this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'nombre de usuario  existente' });
                }
                else{
               this.MessageService.add({ severity: 'error', summary: 'Error', detail: ' correo electrónico existente' });
              }
             }
           },
          error: (error:any) => 
          {
          //MANEJAR ERRORES DE COMUNICACIONES CON EL SERVIDOR-HANDLING COMMUNICATIONS ERRORS WITH THE SERVER             
          this.MessageService.add({ severity: 'error', summary: 'Server Error', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });

          }
        });
    }
  
  
    
    //AGREGAR USUARIO EN LA BASE DE DATOS-ADD USER IN THE DATABASE
    addUser() {
      const user = this.signinForm.value;
        this._authsr.signin(user)
          .subscribe({
            next: (response: any) => 
            {
             if (response.success) 
             {
              this.MessageService.add({ severity: 'info', summary: 'Confirmed', detail: '¡El registro fue exitoso!' });
              this.disable = true;
              this.router.navigate(['login'] , 
              {
                state: { signin: true} 
              }
            );
              } 
            },
            error: (error:any) => 
            {
            // MANEJAR ERRORES DE COMUNICACIONES CON EL SERVIDOR-HANDLING COMMUNICATIONS ERRORS WITH THE SERVER              
            this.MessageService.add({ severity: 'error', summary: 'Server Error', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });
 
            }
          });
      }


      
    }






