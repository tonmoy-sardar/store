import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YourExpenseRoutingModule } from './your-expense-routing.module';
import { YourExpenseComponent } from './your-expense.component';
// core
import { CoreModule } from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    YourExpenseRoutingModule,
    CoreModule
  ],
  declarations: [YourExpenseComponent]
})
export class YourExpenseModule { }
