import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,  
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsModule' },
      { path: 'your-expense', loadChildren: './your-expense/your-expense.module#YourExpenseModule' },
      { path: 'franchise-club', loadChildren: './franchise-club/franchise-club.module#FranchiseClubModule' },
      { path: 'create-app', loadChildren: './create-app/create-app.module#CreateAppModule' },
      { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
      { path: 'app-success', loadChildren: './app-success/app-success.module#AppSuccessModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
