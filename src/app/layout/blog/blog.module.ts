import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    CoreModule
  ],
  declarations: [BlogComponent]
})
export class BlogModule { }
