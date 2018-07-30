import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/dashboard/app-store',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'app-store', loadChildren: './app-store/app-store.module#AppStoreModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
      { path: 'franchise-user', loadChildren: './franchise-user/franchise-user.module#FranchiseUserModule' }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
