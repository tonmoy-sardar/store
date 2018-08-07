import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    AboutUsRoutingModule,
    CoreModule
  ],
  declarations: [AboutUsComponent]
})
export class AboutUsModule { }
