import { Component } from '@angular/core';
import { ConfirmEventType, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { saveAs } from 'file-saver';
import jwt_decode from 'jwt-decode';
//SERVICES
import { FileManager } from '../Services/FileManager';
import { AuthorizationService } from '../Services/AuthorizationServices';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})

export class MainpageComponent {

  //VARIABLES
  emailDialogVisible: boolean = false;
  emailRecipient: string = '';
  emailSubject: string = '';
  emailBody: string = '';
  fileid: any;
  Files!: any[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  uploadedFiles: any[] = [];
  selectedRowIndex!: number; // VARIABLE PARA DIBUJAR EL ÍNDICE DE LA FILA SELECCIONADA-VARIABLE TO DRAW THE INDEX OF THE SELECTED ROW
  isLoggedIn: boolean=true;
  emailForm!: FormGroup;
  
 constructor(private MessageService: MessageService, private _fm:FileManager, 
    private _authsr: AuthorizationService, private _confService:ConfirmationService,public router: Router, public formBuilder:FormBuilder) {}
// OBTENER DATOS DE LA PÁGINA DE INICIO DE SESIÓN Y DE LA BASE DE DATOS-GET DATA FROM LOGIN PAGE AND DATABASE
  ngOnInit() {   
    this.getDataEmail();
    const values=Object.values( history.state);
    const decodedToken: any = jwt_decode(values.join(''));
    const id= decodedToken.userId;
    const name=decodedToken.name;
    const email=decodedToken.email;
    let body:any = {};
    body['token'] = values.join('');
    body['id'] = id;
    body['name'] = name;
    body['email'] = email;

    this._authsr.loginData(body);
    this.getFiles();
    
  }
  //RESTABLECIMIENTO DEL FORMULARIO DE CORREO ELECTRÓNICO-RESETTING THE EMAIL FORM 
 showEmailDialog(file: any): void {
    this.emailRecipient = ''; 
    this.emailSubject = '';
    this.emailBody = '';
    this.fileid=file.id_file;
    this.emailDialogVisible = true;
  }
  //ENVIANDO CORREO A * PERSONA CON EL ARCHIVO ELEGIDO-SENDING EMAIL TO * PERSON WITH THE FILE CHOOSEN
  sendEmail(): void {
    const email= this.emailForm.value; 
      email['id_file']=this.fileid;
      email['name']=this._authsr.getName();
      email['email']=this._authsr.getEmail();
      if(this.checkEmailValidity()){
        this._fm.sendEmail(email).subscribe({
          next: (response: any) => 
          {
            console.log(response);
            const form:any={
              file:response[0].name,
              id_user:this._authsr.getId(),
              action:"sendEmail"
            }
            this.sendLog(form);
          },
          error: (error:any) => 
          {
            this.MessageService.add({ severity: 'error', summary: 'Error del Servidor', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });
      
          }
        
        
      });
    
  
      this.hideEmailDialog();
      }
      
  }



   checkEmailValidity(){
    const email:any = this.emailForm.get('Destinatario');

    if (email.errors) {
      if (email.errors.email) {
        console.log("aaaaa");
        this.MessageService.add({ severity: 'error', summary: 'Error del Servidor', detail: 'Correo electrónico no válido' });
        return false;
      }
    } else {
      this.MessageService.add({ severity: 'success', summary: 'Éxito del Servidor', detail: 'Correo electrónico enviado correctamente' });
      return true;
    }
    return false;
  }


//OBTENER DATOS DE CORREO ELECTRÓNICO DESDE EL FORMULARIO-GETTING EMAIL DATA FROM THE FORM 
  getDataEmail(){
    this.emailForm =this.formBuilder.group({
      Destinatario: ['', [Validators.required, Validators.email]],
      Asunto: new FormControl('', Validators.required),
    })

  }
 
  hideEmailDialog(): void {
    this.emailDialogVisible = false;
  }

  
  //LOGOUT
  onQuitClicked() {
    // CERRAR SESIÓN Y NAVEGAR A LA PÁGINA DE INICIO DE SESIÓN-LOG OUT AND NAVIGATE TO THE LOGIN PAGE
   this._authsr.logout();
    // OTROS CÓDIGOS DE SALIDA COMO ELIMINACIÓN DE DATOS DE USUARIO, TOKEN, ETC.-OTHER EXIT CODES SUCH AS DELETION OF USER DATA, TOKEN, ETC.
    // TAMBIÉN PUEDE UTILIZAR UN SERVICIO DE AUTENTICACIÓN PARA GESTIONAR SU CIERRE DE SESIÓN.-YOU CAN ALSO USE AN AUTHENTICATION SERVICE TO MANAGE YOUR LOGOUT.
  }
  
  
  //AÑADIR FUNCIÓN DE ARCHIVOADD FILE FUNCTION
  onUpload(event:any) {

    console.log('aqui')

    for (let file of event.files) {
      console.log(file);
      this.uploadFile(file);
    }
      this.MessageService.add({severity: 'success', summary: 'Archivo subido', detail: 'El archivo ha subido correctamente'});
  }



//AÑADIR ARCHIVO EN LA BASE DE DATOS-ADD FILE IN THE DATABASE
  uploadFile(file: File): void {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name) 
    const id= this._authsr.getId();
    const size=file.size;
    formData.append('id', id );
    formData.append('size',String(size) );
      let body:any = {};
      body['file'] = file.name;
      body['id'] = id;
   this._fm.upload(formData).subscribe({
    next: (response: any) => 
    {
      const form:any={
        file:file.name,
        id_user:this._authsr.getId(),
        action:"upload"
      }
      this.sendLog(form);
      this.getFiles(); 
    },
    error: (error:any) => 
    {
      console.log();
      //MANEJAR ERRORES DE COMUNICACIONES CON EL SERVIDOR-HANDLE COMMUNICATIONS ERRORS WITH THE SERVER
      this.MessageService.add({ severity: 'error', summary: 'Error del Servidor', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });

    }
  });
  }



//REGISTRO DE ENVÍO-SENDING LOG 
  sendLog(body:any) {
    console.log(body);
    this._fm.sendLog(body).subscribe({
      next: (response: any) => 
      {
      },
      error: (error:any) => 
      {
        this.MessageService.add({ severity: 'error', summary: 'Error del Servidor', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });
  
      }
    
    
  });
}




  //FUNCIÓN PARA OBTENER ARCHIVOS DE LA BASE DE DATOS-FUNCTION TO GET FILES FROM THE DATABASE
  getFiles() : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._fm.getfiles().subscribe({
        next: (response: any) => 
        {
          this.Files = response;
          resolve(this.Files);
        },
        error: (error: any) => 
        {
          reject(error);
        }
      });
    });
  }
  


  getData(): Promise<any> {
    return this.getFiles();
  }




  //FUNCIÓN PARA ELIMINAR ARCHIVOS DE LA BASE DE DATOS-FUNCTION TO DELETE FILES FROM THE DATABASE
  DeleteFile(file: any): void {
    
    const id= this._authsr.getId();
    if (id === file.user_id) {
      this.deleteConfirmation(file);
    } else {
      this.MessageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No estas autorizado' });
    }
  }
  deleteConfirmation(file: any) {
    this._confService.confirm({
      message: '¿Estás seguro de que quieres continuar?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFileFromDatabase(file);
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.MessageService.add({ severity: 'success', summary: 'Cancelado con éxito', detail: 'La eliminación del archivo ha sido cancelada. El archivo no ha sido eliminado' });
            break;
          case ConfirmEventType.CANCEL:
            this.MessageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado' });
            break;
        }
      }
    });
  }
  deleteFileFromDatabase(file: any) {
    const body: any = {
      id_file: file.id_file
    };
  //SOLICITUD HTTP PARA ELIMINAR EL ARCHIVO DE LA BASE DE DATOS-HTTP REQUEST TO DELETE THE FILE FROM THE DATABASE
    this._fm.deleteFile(body).subscribe({
      next: (response: any) => {
        const form:any={
          file:file.name,
          id_user:this._authsr.getId(),
          action:"delete"
        }
        this.sendLog(form);
        this.getFiles();
        this.MessageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Archivo eliminado con éxito' });
      },
      error: (error: any) => {
        // MANEJAR ERRORES DE COMUNICACIÓN CON EL SERVIDOR-HANDLING COMMUNICATION ERRORS WITH THE SERVER
        this.MessageService.add({ severity: 'error', summary: 'Error del Servidor', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });
      }
    });
  } 
 
 
 //DESCARGAR ARCHIVO FUNCIÓN-DOWNLOAD FILE FUNCTION
  handleDownload(file: any): void{
    let body:any = {};
    const id= this._authsr.getId;
    body ['id_file'] = file.id_file;
        this._fm.downloadFile(body).subscribe({
        next: (response: any) => 
        {
          const form:any={
            file:file.name,
            id_user:this._authsr.getId(),
            action:"download"
          }
          this.sendLog(form);
          let blob:any = new Blob([response], { type:file.type});
          saveAs(blob,file.name);
         },
        error: (error:any) => {
    // MANEJAR ERRORES DE COMUNICACIÓN CON EL SERVIDOR-HANDLING COMMUNICATION ERRORS WITH THE SERVER
    this.MessageService.add({ severity: 'error', summary: 'Server Error', detail: 'La conexión con el servidor falló, inténtalo de nuevo más tarde' });
    }
  });
  }
// CONVERTIR LOS BYTES EN MB, GB, KB-CONVERTING THE BYTES IN MB,GB,KB  
   formatSizeUnits(bytes:any){
    if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1)           { bytes = bytes + " bytes"; }
    else if (bytes == 1)          { bytes = bytes + " byte"; }
    else                          { bytes = "0 bytes"; }
    return bytes;
  }
  TypeOfData(type:string){
    if      (type.includes("plain"))   { type = "TXT"; }
    else if (type.includes("pdf"))    { type ="PDF"; }
    else if (type.includes("zip"))    { type = "ZIP"; }
    else if (type.includes("png"))    { type = "PNG"; }
    else if (type.includes("img"))    { type = "IMG"; }
    else if (type.includes("jpg"))    { type = "JPG"; }
    else if (type.includes("svg"))    { type = "SVG"; }
    else if (type.includes("csv"))    { type = "CSV"; }
    else if (type.includes("document"))    { type = "DOCX"; }
    else if (type.includes("audio"))    { type = "MP3"; }
    else if (type.includes("video"))    { type = "MP4"; }
    else                              { type = type; }
    return type

  }
}
