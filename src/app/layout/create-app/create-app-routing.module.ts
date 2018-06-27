import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAppComponent } from './create-app.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { StepFourComponent } from './step-four/step-four.component';

const routes: Routes = [
  {
    path: '',
    component: CreateAppComponent
  },
  {
    path: 'step-one',
    component: StepOneComponent
  },
  {
    path: 'step-two',
    component: StepTwoComponent
  },
  {
    path: 'step-three',
    component: StepThreeComponent
  },
  {
    path: 'step-four',
    component: StepFourComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateAppRoutingModule { }
