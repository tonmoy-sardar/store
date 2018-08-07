import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FranchiseClubRoutingModule } from './franchise-club-routing.module';
import { FranchiseClubComponent } from './franchise-club.component';
// core
import { CoreModule } from "../../core/core.module";
@NgModule({
  imports: [
    CommonModule,
    FranchiseClubRoutingModule,
    CoreModule
  ],
  declarations: [FranchiseClubComponent]
})
export class FranchiseClubModule { }
