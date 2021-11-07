import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[validationErrorAnchor]',
  exportAs: 'validationErrorAnchor'
})
export class ValidationErrorAnchorDirective {
  constructor(public vcr: ViewContainerRef) {}
}
