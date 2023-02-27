import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from "@angular/common";
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from '../login/login.component';

const routes = [
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
