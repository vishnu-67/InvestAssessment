import { NgModule } from '@angular/core';
import { AssesstmentComponent } from './assesstment.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";

import { CommonModule } from "@angular/common";
import { MatInputModule } from '@angular/material/input';

const routes = [
  {
    path: 'assesst',
    component: AssesstmentComponent
  }
];

@NgModule({
  declarations: [AssesstmentComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,

  ],
  exports: [
    AssesstmentComponent
  ]
})
export class AssessmentModule { }
