import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
