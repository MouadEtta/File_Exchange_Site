import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import jwt_decode from 'jwt-decode';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() quitClicked: EventEmitter<void> = new EventEmitter<void>();
   items!: MenuItem[];
   chartVisible: boolean = false;

   constructor(private router: Router) {}
   //ICONS HEADER
    ngOnInit() {
      this.checkUser();
        this.items = [           
           {
                label: 'Abandonar',
                icon: 'pi pi-fw pi-power-off', 
                routerLink:'/login',
                command: () => {
                  this.logout();}
            },
            {
              label: 'Chart',
              icon: 'pi pi-fw pi-chart-bar', 
              routerLink:'/charts',
              visible: this.chartVisible,
              
                
          }
        ];
        
    }
    //COMPROBAR SI EL USUARIO ES EL ADMINISTRADOR PARA MOSTRAR EL BOTÓN GRÁFICO-CHECK IF THE USER IS THE ADMINISTATOR TO SHOW THE CHART BUTTON
    checkUser() {
      const token = localStorage.getItem('key');
      if (token) {
        const decodedToken: any = jwt_decode(token);
        const id = decodedToken.userId;
        this.chartVisible = (id === 28);
      } else {
        this.chartVisible = false;
      }
    }
  logout() {
   this.quitClicked.emit();
  }
  getState(): NavigationExtras {
    const token: any = localStorage.getItem('key');
    return { state: token }; // Restituisce l'oggetto NavigationExtras con lo stato
  }
}
