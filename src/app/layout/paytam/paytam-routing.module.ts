import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaytamComponent } from './paytam.component';

const routes: Routes = [
  {
    path: '',
    component: PaytamComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaytamRoutingModule { }
