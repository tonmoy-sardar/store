import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateAppRoutingModule } from './create-app-routing.module';
import { CreateAppComponent } from './create-app.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { StepFourComponent } from './step-four/step-four.component';


@NgModule({
  imports: [
    CommonModule,
    CreateAppRoutingModule
  ],
  declarations: [CreateAppComponent, StepOneComponent, StepTwoComponent, StepThreeComponent, StepFourComponent]
})
export class CreateAppModule { }
