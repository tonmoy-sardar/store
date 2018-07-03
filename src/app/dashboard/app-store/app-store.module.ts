import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppStoreRoutingModule } from './app-store-routing.module';
import { AppStoreComponent } from './app-store.component';
import { EditAppComponent } from './edit-app/edit-app.component';

// core
import { CoreModule } from "../../core/core.module";


@NgModule({
  imports: [
    CommonModule,
    AppStoreRoutingModule,
    CoreModule
  ],
  declarations: [AppStoreComponent, EditAppComponent]
})
export class AppStoreModule { }
