import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogdetailsComponent } from './blogdetails.component';
import { BlogdetailsRoutingModule } from './blogdetails-routing.module';
// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    BlogdetailsRoutingModule,
    CoreModule
  ],
  declarations: [BlogdetailsComponent]
})
export class BlogdetailsModule { }
