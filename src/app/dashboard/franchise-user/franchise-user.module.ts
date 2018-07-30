import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FranchiseUserRoutingModule } from './franchise-user-routing.module';
import { FranchiseUserComponent } from './franchise-user.component';
// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    FranchiseUserRoutingModule,
    CoreModule
  ],
  declarations: [FranchiseUserComponent]
})
export class FranchiseUserModule { }
