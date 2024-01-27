import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Other routes...
  // { path: 'lazy-feature', loadChildren: () => import('./lazy-feature/lazy-feature.module').then(m => m.LazyFeatureModule) },
  { path: '', loadChildren: () => import('./Pages/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./Pages/Auth/login/login.module').then(m => m.LoginComponentModule) },
  { path: 'profile/:id', loadChildren: () => import('./Pages/User/user-profile/user-profile.module').then(m => m.UserProfileModule) },
  { path: 'register', loadChildren: () => import('./Pages/Auth/register/register.module').then(m => m.RegisterModule) },
  { path: 'editor', loadChildren: () => import('./Pages/Article/editor/editor.module').then(m => m.EditorModule) },
  { path: 'viewer/:id', loadChildren: () => import('./Pages/Article/viewer/viewer.module').then(m => m.ViewerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
