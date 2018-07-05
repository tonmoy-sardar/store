import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppStoreComponent } from './app-store.component';
import { EditAppComponent } from './edit-app/edit-app.component';

const routes: Routes = [
  {
    path: '',
    component: AppStoreComponent
  },
  {
    path: 'edit-app/:id',
    component: EditAppComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppStoreRoutingModule { }
