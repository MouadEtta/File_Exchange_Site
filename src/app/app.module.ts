import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
//primeng imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { LoginComponent } from './login/login.component';
import { AuthorizationService } from './Services/AuthorizationServices';
import { PasswordModule } from 'primeng/password';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HeaderComponent } from './header/header.component';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuthGuard } from './Services/auth_guard/auth.guard';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ChartsComponent } from './charts/charts.component';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainpageComponent,
    SignInComponent,
    HeaderComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    PasswordModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    MultiSelectModule,
    FileUploadModule,
    TagModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmDialogModule,
    RadioButtonModule,
    DynamicDialogModule,
    DialogModule,
    ChartModule,
    DropdownModule

  ],
  providers: [AuthorizationService,HttpClient, MessageService, ConfirmationService,[AuthGuard],DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
