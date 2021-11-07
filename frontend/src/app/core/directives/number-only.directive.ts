import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "input[naviNumbersOnly]"
})
export class NumberOnlyDirective {
  // Only want positive integers
  private regex: RegExp = new RegExp(/^\d+$/g);
  // Allow key codes for special events Backspace, tab, end, home
  private specialKeys = ["Backspace", "Tab", "End", "Home", "ArrowRight", "ArrowLeft"];
  constructor(private element: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (
      // Allow: 'Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'
      this.specialKeys.indexOf(event.key) > -1 ||
      // Allow: Ctrl+A
      (event.key.toUpperCase() == "A" && event.ctrlKey === true) ||
      // Allow: Ctrl+C
      (event.key.toUpperCase() == "C" && event.ctrlKey === true) ||
      // Allow: Ctrl+V
      (event.key.toUpperCase() == "V" && event.ctrlKey === true) ||
      // Allow: Ctrl+X
      (event.key.toUpperCase() == "X" && event.ctrlKey === true)
    ) {
      return;
    }
    let current: string = this.element.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener("input", ["$event"])
  onInputChange(event) {
    const initalValue = this.element.nativeElement.value;
    // Allow paste but remove all non numbers
    this.element.nativeElement.value = initalValue.replace(/[^0-9]*/g, "");
    if (initalValue !== this.element.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
