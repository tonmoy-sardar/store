import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytamRoutingModule } from './paytam-routing.module';
import { PaytamComponent } from './paytam.component';

// core
import { CoreModule } from "../../core/core.module";


@NgModule({
  imports: [
    CommonModule,
    PaytamRoutingModule,
    CoreModule
  ],
  declarations: [PaytamComponent]
})
export class PaytamModule { }
