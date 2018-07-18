import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSuccessRoutingModule } from './app-success-routing.module';
import { AppSuccessComponent } from './app-success.component';

// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    AppSuccessRoutingModule,
    CoreModule

  ],
  declarations: [AppSuccessComponent]
})
export class AppSuccessModule { }
