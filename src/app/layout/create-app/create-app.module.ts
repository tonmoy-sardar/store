import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateAppRoutingModule } from './create-app-routing.module';
import { CreateAppComponent } from './create-app.component';


// core
import { CoreModule } from "../../core/core.module";
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { StepFourComponent } from './step-four/step-four.component';
import { StepRegisterComponent } from './step-register/step-register.component';

@NgModule({
  imports: [
    CommonModule,
    CreateAppRoutingModule,
    CoreModule
  ],
  declarations: [CreateAppComponent, StepOneComponent, StepTwoComponent, StepThreeComponent, StepFourComponent, StepRegisterComponent]
})
export class CreateAppModule { }
