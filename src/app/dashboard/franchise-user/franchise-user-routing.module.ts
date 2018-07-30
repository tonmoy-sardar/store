import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FranchiseUserComponent } from './franchise-user.component';
const routes: Routes = [
  {
    path: '',
    component: FranchiseUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FranchiseUserRoutingModule { }
