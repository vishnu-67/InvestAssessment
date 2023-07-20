// shared-pipes.module.ts
import { NgModule } from '@angular/core';
import { LineBreaksPipe } from './_pipes/textTransfer.pipe';

@NgModule({
  declarations: [LineBreaksPipe],
  exports: [LineBreaksPipe],
})
export class SharedPipesModule { }
