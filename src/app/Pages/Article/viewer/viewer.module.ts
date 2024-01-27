import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './viewer.component';

const routes: Routes = [
  { path: '', component: ViewerComponent },
  // Additional routes for other components within the module...
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ViewerModule { }
