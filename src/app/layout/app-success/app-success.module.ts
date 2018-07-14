import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSuccessRoutingModule } from './app-success-routing.module';
import { AppSuccessComponent } from './app-success.component';

@NgModule({
  imports: [
    CommonModule,
    AppSuccessRoutingModule
  ],
  declarations: [AppSuccessComponent]
})
export class AppSuccessModule { }
