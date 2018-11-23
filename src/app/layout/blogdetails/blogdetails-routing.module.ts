import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogdetailsComponent } from './blogdetails.component';

const routes: Routes = [
  {
    path: '',
    component: BlogdetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogdetailsRoutingModule { }
