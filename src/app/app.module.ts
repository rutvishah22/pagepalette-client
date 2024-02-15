import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { HomeComponent } from './Pages/home/home.component';
import { EditorComponent } from './Pages/Article/editor/editor.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ViewerComponent } from './Pages/Article/viewer/viewer.component';
import { UserProfileComponent } from './Pages/User/user-profile/user-profile.component';
import { MyModalComponent } from './Components/my-modal/my-modal.component';
import { CustomInterceptor } from './services/Interceptors/custom.interceptor';
// import EditorJS from '@editorjs/editorjs';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    EditorComponent,
    NavbarComponent,
    ViewerComponent,
    UserProfileComponent,
    MyModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:CustomInterceptor, multi:true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
