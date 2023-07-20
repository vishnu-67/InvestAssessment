import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreaks'
})
export class LineBreaksPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  }
}