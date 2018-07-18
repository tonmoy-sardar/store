import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';

// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    CoreModule
  ],
  declarations: [PaymentComponent]
})
export class PaymentModule { }
