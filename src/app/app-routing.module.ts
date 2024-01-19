import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './Pages/Article/editor/editor.component';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { RegisterComponent } from './Pages/Auth/register/register.component';
import { ViewerComponent } from './Pages/Article/viewer/viewer.component';
import { UserProfileComponent } from './Pages/User/user-profile/user-profile.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'', component:HomeComponent},
  {path:'editor', component:EditorComponent},
  { path: 'viewer/:id', component: ViewerComponent },
  {path:'profile/:id',component: UserProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
