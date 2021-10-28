import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef
} from '@angular/core';
import { AbstractControl, ControlContainer, NgControl, ValidationErrors } from '@angular/forms';
import { ValidationMessagesComponent, ValidationErrorComponent } from './Validation-messages.component';
import { ValidationErrorAnchorDirective } from './validaion-error-anchor.directive';
import { EMPTY, fromEvent, merge, NEVER, Observable, Subject } from 'rxjs';
import { ControlErrorConfig, ControlErrorConfigProvider, FORM_ERRORS } from './providers';
import { distinctUntilChanged, mapTo, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FormActionDirective } from './form-action.directive';
import { ErrorsMap } from './types';

@Directive({
  selector:
    '[formControlName]:not([controlErrorsIgnore]), [formControl]:not([controlErrorsIgnore]), [formGroup]:not([controlErrorsIgnore]), [formGroupName]:not([controlErrorsIgnore]), [formArrayName]:not([controlErrorsIgnore]), [ngModel]:not([controlErrorsIgnore])',
  exportAs: 'controlError'
})
export class ValidationErrorsDirective implements OnInit, OnDestroy {
  @Input('controlErrors') customErrors: ErrorsMap = {};
  // @Input() controlErrorsClass: string | undefined;
  @Input() controlErrorsTpl: TemplateRef<any> | undefined;
  @Input() controlErrorsOnAsync = true;
  @Input() controlErrorsOnBlur = true;
  @Input() validationErrorAnchor: ValidationErrorAnchorDirective;

  private ref: ComponentRef<ValidationErrorComponent>;
  private anchor: ViewContainerRef;
  private submit$: Observable<Event>;
  private reset$: Observable<Event>;
  private control: AbstractControl;
  private destroy = new Subject();
  private showError$ = new Subject();
  private mergedConfig: ControlErrorConfig = {};
  private customAnchorDestroyFn: () => void;

  constructor(
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private host: ElementRef,
    @Inject(ControlErrorConfigProvider) private config: ControlErrorConfig,
    @Inject(FORM_ERRORS) private globalErrors,
    @Optional() private validationErrorAnchorParent: ValidationErrorAnchorDirective,
    @Optional() private form: FormActionDirective,
    @Optional() @Self() private ngControl: NgControl,
    @Optional() @Self() private controlContainer: ControlContainer
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.reset$ = this.form ? this.form.reset$ : EMPTY;
    this.mergedConfig = this.buildConfig();
  }

  ngOnInit() {
    this.anchor = this.resolveAnchor();
    this.control = (this.controlContainer || this.ngControl).control;
    const hasAsyncValidator = !!this.control.asyncValidator;

    const statusChanges$ = this.control.statusChanges.pipe(distinctUntilChanged());
    const valueChanges$ = this.control.valueChanges;
    const controlChanges$ = merge(statusChanges$, valueChanges$);
    let changesOnAsync$: Observable<any> = EMPTY;
    let changesOnBlur$: Observable<any> = EMPTY;

    if (this.controlErrorsOnAsync && hasAsyncValidator) {
      // hasAsyncThenUponStatusChange
      changesOnAsync$ = statusChanges$.pipe(startWith(true));
    }

    if (this.controlErrorsOnBlur && this.isInput) {
      const blur$ = fromEvent(this.host.nativeElement, 'focusout');
      // blurFirstThenUponChange
      changesOnBlur$ = blur$.pipe(switchMap(() => valueChanges$.pipe(startWith(true))));
    }

    const submit$ = merge(this.submit$.pipe(mapTo(true)), this.reset$.pipe(mapTo(false)));

    // when submitted, submitFirstThenUponChanges
    const changesOnSubmit$ = submit$.pipe(
      switchMap(submit => (submit ? controlChanges$.pipe(startWith(true)) : NEVER))
    );

    // on reset, clear ComponentRef and customAnchorDestroyFn
    this.reset$.pipe(takeUntil(this.destroy)).subscribe(() => this.clearRefs());

    merge(changesOnAsync$, changesOnBlur$, changesOnSubmit$, this.showError$)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.valueChanges());
  }

  private setError(text: string, error?: ValidationErrors) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory<ValidationErrorComponent>(
        this.mergedConfig.controlErrorComponent
      );
      this.ref = this.anchor.createComponent<ValidationErrorComponent>(factory);
    }
    const instance = this.ref.instance;

    if (this.controlErrorsTpl) {
      instance.createTemplate(this.controlErrorsTpl, error, text);
    } else {
      instance.text = text;
    }

    // if (this.controlErrorsClass) {
    //   instance.customClass = this.controlErrorsClass;
    // }

    if (!this.validationErrorAnchor && this.mergedConfig.controlErrorComponentAnchorFn) {
      this.customAnchorDestroyFn = this.mergedConfig.controlErrorComponentAnchorFn(
        this.host.nativeElement as HTMLElement,
        (this.ref.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement
      );
    }
  }

  /**
   * Explicit showing of a control error via some custom application code.
   */
  showError(): void {
    this.showError$.next();
  }

  /**
   * Explicit hiding of a control error via some custom application code.
   */
  hideError(): void {
    this.setError(null);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.clearRefs();
  }

  private get isInput() {
    return this.mergedConfig.blurPredicate(this.host.nativeElement);
  }

  private clearRefs(): void {
    if (this.customAnchorDestroyFn) {
      this.customAnchorDestroyFn();
      this.customAnchorDestroyFn = null;
    }
    if (this.ref) {
      this.ref.destroy();
    }
    this.ref = null;
  }

  private valueChanges() {
    const controlErrors = this.control.errors;
    if (controlErrors) {
      const [firstKey] = Object.keys(controlErrors);
      const getError = this.customErrors[firstKey] || this.globalErrors[firstKey];
      if (!getError) {
        return;
      }

      const text = typeof getError === 'function' ? getError(controlErrors[firstKey]) : getError;
      if (this.isInput) {
        this.host.nativeElement.parentElement.classList.add('error-tailor-has-error');
      }
      this.setError(text, controlErrors);
    } else if (this.ref) {
      if (this.isInput) {
        this.host.nativeElement.parentElement.classList.remove('error-tailor-has-error');
      }
      this.setError(null);
    }
  }

  private resolveAnchor() {
    if (this.validationErrorAnchor) {
      return this.validationErrorAnchor.vcr;
    }

    if (this.validationErrorAnchorParent) {
      return this.validationErrorAnchorParent.vcr;
    }
    return this.vcr;
  }

  private buildConfig(): ControlErrorConfig {
    return {
      ...{
        blurPredicate(element) {
          return element.tagName === 'INPUT' || element.tagName === 'SELECT';
        },
        controlErrorComponent: ValidationMessagesComponent
      },
      ...this.config
    };
  }
}
