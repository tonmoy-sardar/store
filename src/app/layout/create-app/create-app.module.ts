import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateAppRoutingModule } from './create-app-routing.module';
import { CreateAppComponent } from './create-app.component';


// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    CreateAppRoutingModule,
    CoreModule
  ],
  declarations: [CreateAppComponent]
})
export class CreateAppModule { }
