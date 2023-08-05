
import { Component, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../Services/AuthorizationServices';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
   //FORM
   loginForm!: FormGroup;

   //BOTON DE LOGIN-LOGIN BUTTON
disable: boolean = false;
isLoading: boolean= false;

constructor(public router: Router,private _authsr: AuthorizationService, private MessageService:MessageService){}

ngOnInit(){
  const IsSignIn=history.state.signin
  if(IsSignIn){
    setTimeout(() => {
      this.MessageService.add({
        severity: 'success',
        summary: 'Confirmed ',
        detail: '¡El registro fue exitoso!',
        sticky: true // Duración del brindis en milisegundos-Toast duration in milliseconds
      });
    });  }
 this.getDataLoginForm();
}
//FORMULARIO DE OBTENER DATOS-GETTING DATA FORM
   getDataLoginForm(){
   this.loginForm = new FormGroup({
  
     Username: new FormControl('', Validators.required),
     Password: new FormControl('', Validators.required),

   })
 }
//COMPROBACIÓN DE DATOS DE LA BASE DE DATOS-DATABASE CHECK
 check() {
  
   const user = this.loginForm.value;
   this._authsr.login(user)
     .subscribe({
       next: (response: any) => {      
        if (response.success) {
           this.disable = true;
           localStorage.setItem('key', response.token);
           this.router.navigate(['MainPage'],{state:response.token});
         } else {
           // USUARIO NO AUTENTICADO, MENSAJE DE ERROR-UNAUTHENTICATED USER, ERROR MESSAGE
           this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Nombre de usuario o contraseña incorrectos' })
         }
       },
       error: (error:any) => {
         //MANEJAR ERRORES DE COMUNICACIÓN CON EL SERVIDOR-HANDLING COMMUNICATION ERRORS WITH THE SERVER
         this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' })
       }
     });
 }

}