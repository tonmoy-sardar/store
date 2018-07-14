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
      { path: 'create-app', loadChildren: './create-app/create-app.module#CreateAppModule' },
      { path: 'paytam', loadChildren: './paytam/paytam.module#PaytamModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
