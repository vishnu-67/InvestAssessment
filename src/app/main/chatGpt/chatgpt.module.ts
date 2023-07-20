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
import { MatSelectModule } from '@angular/material/select';
//import { LineBreaksPipe } from 'app/core/_pipes/textTransfer.pipe';
import { ChatgptComponent } from './chatgpt.component';
import { SharedPipesModule } from 'app/core/sharedpipes.module';
import { CloseAfterSelectDirective } from 'app/core/directive/closeAfterSelect.directive';
const routes = [
  {
    path: 'strategic',
    component: ChatgptComponent
  }
];

@NgModule({
  declarations: [ChatgptComponent,CloseAfterSelectDirective],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    SharedPipesModule
  ],
  exports: [
    ChatgptComponent
  ]
})
export class ChatgptModule { }
