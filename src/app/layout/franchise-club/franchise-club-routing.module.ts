import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FranchiseClubComponent } from './franchise-club.component';

const routes: Routes = [
  {
    path: '',
    component: FranchiseClubComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FranchiseClubRoutingModule { }
