import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../Services/AuthorizationServices';
import {  MessageService } from 'primeng/api';
import { LogService } from '../Services/LogService';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit {
    //DATOS PARA EL GRÁFICO DE ISTOGRAM-DATA FOR ISTOGRAM GRAPH
    options: any;
    data: any;
    //ARRAY CON LOS DATOS DE LOGS Y NOMBRES DE USUARIOS DE USUARIOS SELECCIONADOS-ARRAY WITH THE DATA OF LOGS AND USERNAMES OF SELECTED USERS
    Logs!: any[];
    Month:any = {};
    filterText: string = '';
    userLogs!: any[];
    
    //DATOS PARA EL  GRÁFICO CIRCULAR FOR CAKE GRAPH
    userOptions: any;
    userData: any;
    //DATOS PARA EL DESPLEGABLE-DATA FOR DROPDOWN 
    users: any= {};
    selectedUsers!: any;
    isUserChartVisible: boolean = false;



    constructor(public router: Router,private _authsr: AuthorizationService, private MessageService:MessageService, private _logsr:LogService){}
    ngOnInit() {
        this.getLogs().then(() => {
          this.getUsers().then(() => {
            console.log(this.users);
            this.Month = this.initMonths();
            this.istogram();}).catch(error=>{
              console.error(error);
            })
          }).catch(error => {
            console.error(error);
          });

       
    }
    //OPCIONES PARA CREAR EL GRÁFICO DE ISTOGRAM-OPTIONS TO CREATE THE ISTOGRAM GRAPH
    istogram(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
        this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Download',
              backgroundColor: '#55a098',
              borderColor: '#55a098',
              data: [this.Month['January'][1], this.Month['February'][1], this.Month['March'][1], this.Month['April'][1], this.Month['May'][1], this.Month['June'][1], this.Month['July'][1], this.Month['August'][1], this.Month['September'][1], this.Month['October'][1], this.Month['November'][1], this.Month['December'][1]]
            },
            {
              label: 'Upload',
              backgroundColor: '#ffc0cb',
              borderColor: '#ffc0cb',
              data: [this.Month['January'][0], this.Month['February'][0], this.Month['March'][0], this.Month['April'][0], this.Month['May'][0], this.Month['June'][0], this.Month['July'][0],this.Month['August'][0], this.Month['September'][0], this.Month['October'][0], this.Month['November'][0], this.Month['December'][0]]
            },
            {
              label: 'Delete',
              backgroundColor: '#CC0000',
              borderColor: ' #CC0000',
              data: [this.Month['January'][2], this.Month['February'][2], this.Month['March'][2], this.Month['April'][2], this.Month['May'][2], this.Month['June'][2], this.Month['July'][2], this.Month['August'][2], this.Month['September'][2], this.Month['October'][2], this.Month['November'][2], this.Month['December'][2]]
            },
            {
              label: 'Email',
              backgroundColor: '#e7a24b',
              borderColor: '#e7a24b',
              data: [this.Month['January'][3], this.Month['February'][3], this.Month['March'][3], this.Month['April'][3], this.Month['May'][3], this.Month['June'][3], this.Month['July'][3], this.Month['August'][3], this.Month['September'][3], this.Month['October'][3], this.Month['November'][3], this.Month['December'][3]]
            }
          ]
        };
         this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }

        }
    };
    }
  //OPCIONES PARA CREAR EL GRÁFICO CIRCULAR-OPTIONS TO CREATE THE CAKE GRAPH
    cake(){
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        console.log(this.userLogs.length)
      if(this.userLogs.length!=0){
        this.userData = {
          labels: ['Download', 'Upload', 'Delete', 'Email'],
          datasets: [
              {
                  data: [this.userLogs[0],this.userLogs[1],this.userLogs[2],this.userLogs[3],],
                  backgroundColor: ['#55a098', '#ffc0cb', '#CC0000', '#e7a24b'],
                  borderColor: ['#55a098', '#ffc0cb', '#CC0000', '#e7a24b']
              }
          ]
      };
        this.userOptions = {
          plugins: {
              legend: {
                  labels: {
                      usePointStyle: true,
                      color: textColor
                  }
              }
          }
      };
      }     
    }

    //FUNCIÓN PARA EL FILTRO QUE SELECCIONA AL USUARIO SELECCIONADO DEL DESPLEGABLE Y CREA LAS GRÁFICAS CON SUS DATOS
    //FUNCTION FOR THE FILTER THAT PICKS THE SELECTED USER FROM THE DROP DOWN AND CREATES THE GRAPHS WITH HIS DATA
    onUserSelectionChange(){
   console.log(this.selectedUsers);
   if (this.selectedUsers) {
        this.filterText=this.selectedUsers.username;
     
        this.Month=this.initMonths();
        this.istogram();

        console.log(this.userLogs);

        if (this.userLogs[0]==0 && this.userLogs[1]==0 && this.userLogs[2]==0 && this.userLogs[3]==0){
          console.log("ao");
          this.MessageService.add({ severity: 'error', summary: 'sin datos', detail: 'no hay datos para el usuario' })
          this.isUserChartVisible=false;

        }
        else{


          this.cake(); 
          this.isUserChartVisible=true;
        }

      }else{
        this.filterText="";
        this.Month=this.initMonths();
        this.istogram();
        this.isUserChartVisible=false;
      }
      
      

   
      
    }
    //INICIALIZACIÓN DE LOS DATOS DE CADA MES-INITALIZATION FOR THE DATA FOR EVERY MONTH
        initMonths() {
        const monthArray:any = {
          'January': [0, 0, 0, 0],
          'February': [0, 0, 0, 0],
          'March': [0, 0, 0, 0],
          'April': [0, 0, 0, 0],
          'May': [0, 0, 0, 0],
          'June': [0, 0, 0, 0],
          'July': [0, 0, 0, 0],
          'August': [0, 0, 0, 0],
          'September': [0, 0, 0, 0],
          'October': [0, 0, 0, 0],
          'November': [0, 0, 0, 0],
          'December': [0, 0, 0, 0]
        };
        //userArray is the data of one user for the cakegraph
        const userArray:any = [0, 0, 0, 0]
        
        if (this.Logs && this.Logs.length > 0) {
        for (let i = 0; i < this.Logs.length; i++) {
          const log = this.Logs[i];
           const date = new Date(log.date_time);
          const month = date.getMonth();

         
      if ((log.action === "download"&&this.filterText==="")||(log.action === "download"&&log.username===this.filterText)||(log.action === "download"&&log.email===this.filterText)) {
            monthArray[Object.keys(monthArray)[month]][1] += 1;
            //checking if there is a filter or not so we can increment the user data 
            if (this.filterText!="") {userArray[0] += 1;}
          } else if ((log.action === "upload"&&this.filterText==="")||(log.action === "upload"&&log.username===(this.filterText))||(log.action === "upload"&&log.email===this.filterText)) {
            monthArray[Object.keys(monthArray)[month]][0] += 1;
            if (this.filterText!="") {userArray[1] += 1;}           
          } else if ((log.action === "delete"&&this.filterText==="")||(log.action === "delete"&&log.username===this.filterText)||(log.action === "delete"&&log.email===this.filterText)) {
            monthArray[Object.keys(monthArray)[month]][2] += 1;
            if (this.filterText!="") {userArray[2] += 1;}          } else if ((log.action === "sendEmail"&&this.filterText==="")||(log.action === "sendEmail"&&log.username===this.filterText)||(log.action === "sendEmail"&&log.email===this.filterText)) {
            monthArray[Object.keys(monthArray)[month]][3] += 1;
            if (this.filterText!="") {userArray[3] += 1;}          }
        }
        this.userLogs = userArray;
        return monthArray;
    }
        }
    //INITALIZATION OF THE DROPDOWN LIST WITH THE NAME OF ALL THE USERS 
        initUsers(){
        if (this.Logs && this.Logs.length > 0) {
          for (let i = 0; i < this.Logs.length; i++) {
           this.users.push(this.Logs[i].username); 
          }
        }
        return this.users;
        }
              
    //DESCARGAR COMO JPG DE LA CARTA-DOWNLOAD AS A JPG OF THE CHART
        downloadChart(){
        const chartElement:any = document.getElementById('chart'); // Sostituisci 'chart' con l'ID del tuo elemento del grafico
      html2canvas(chartElement).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, 'chart.png');
          } else {
            console.error('Impossibile generare l\'immagine del grafico.');
          }
        });
      }).catch((error) => {
        console.error('Errore durante la generazione dell\'immagine del grafico:', error);
      });
        }
        downloadUserChart(){
        const chartElement:any = document.getElementById('chart1'); // Sostituisci 'chart' con l'ID del tuo elemento del grafico
      html2canvas(chartElement).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, 'chart.png');
          } else {
            console.error('Impossibile generare l\'immagine del grafico.');
          }
        });
      }).catch((error) => {
        console.error('Errore durante la generazione dell\'immagine del grafico:', error);
      });
        }
    //SOLICITUD HTTP PARA OBTENER TODOS LOS LOGS REALIZADOS POR LOS USUARIOS-HTTP REQUEST TO GET ALL THE LOGS MADE BY THE USERS 
        getLogs(): 
        Promise<any> {
            return new Promise<any>((resolve, reject) => {
              this._logsr.getLogs().subscribe({
                next: (response: any) => 
                {
                  this.Logs = response;
                  this.Month=this.initMonths();
                 
                  resolve(this.Logs);
                },
                error: (error: any) => 
                {
                  reject(error);
                }
              });
            });
          }
        getData(): Promise<any> {
            return this.getLogs();
         };

    //SOLICITUD HTTP PARA OBTENER TODOS LOS USUARIOS DE LA BASE DE DATOS PARA EL DESPLEGABLE
    //-HTTP REQUEST TO GET ALL THE USERS FROM THE DB FOR THE DROPDOWN
         getUsers(): 
         Promise<any> {
             return new Promise<any>((resolve, reject) => {
               this._authsr.getUsers().subscribe({
                 next: (response: any) => 
                 {
                   this.users = response;
                   resolve(this.users);
                 },
                 error: (error: any) => 
                 {
                   reject(error);
                 }
               });
             });
           }
          getDataUser(): Promise<any> {
             return this.getUsers();
          };
    //FUNCIÓN PARA EL BOTÓN LOGOUT EN EL ENCABEZADO-FUNCTION FOR THE LOGOUT  BUTTON IN THE HEADER
        onQuitClicked(){

        this._authsr.logout();
        }
}
