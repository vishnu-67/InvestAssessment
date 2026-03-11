import { Directive, HostListener, ElementRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: '[appCloseAfterSelect]'
})
export class CloseAfterSelectDirective {
  constructor(private select: MatSelect, private elementRef: ElementRef) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('test',this.select.panelOpen)
    if (this.select.panelOpen) {
      this.select.close();
      event.stopPropagation();
      this.elementRef.nativeElement.blur();
    }
  }
}
