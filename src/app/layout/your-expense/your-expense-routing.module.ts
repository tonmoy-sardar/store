import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YourExpenseComponent } from './your-expense.component';

const routes: Routes = [
  {
    path: '',
    component: YourExpenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YourExpenseRoutingModule { }
