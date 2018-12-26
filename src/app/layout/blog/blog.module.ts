import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogdetailsComponent } from './blogdetails/blogdetails.component';
import { BlogRoutingModule } from './blog-routing.module';
// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    CoreModule
  ],
  declarations: [BlogComponent, BlogdetailsComponent]
})
export class BlogModule { }
