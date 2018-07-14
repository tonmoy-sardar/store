import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppSuccessComponent } from './app-success.component';

const routes: Routes = [
  {
    path: '',
    component: AppSuccessComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppSuccessRoutingModule { }
