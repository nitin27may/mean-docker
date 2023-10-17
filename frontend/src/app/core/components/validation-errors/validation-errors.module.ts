import { ModuleWithProviders, NgModule } from '@angular/core';
import { ValidationErrorsDirective } from './validation-errors.directive';
import { ValidationErrorAnchorDirective } from './validaion-error-anchor.directive';
import { ValidationMessagesComponent } from './Validation-messages.component';
import { CommonModule } from '@angular/common';
import { FormActionDirective } from './form-action.directive';
import { ControlErrorConfig, ControlErrorConfigProvider, FORM_ERRORS } from './providers';
import { ValidationService } from "./validation-messages.service";

const api = [ValidationMessagesComponent, ValidationErrorAnchorDirective, ValidationErrorsDirective, FormActionDirective];



@NgModule({
    declarations: [
        ValidationErrorsDirective,
        ValidationErrorAnchorDirective,
        ValidationMessagesComponent,
        FormActionDirective
    ],
    imports: [CommonModule],
    exports: [api]
})
export class ValidaionErrorsModule {
  static forRoot(config: ControlErrorConfig = {}): ModuleWithProviders<ValidaionErrorsModule> {
    return {
      ngModule: ValidaionErrorsModule,
      providers: [
        ValidationService,
        {
          provide: ControlErrorConfigProvider,
          useValue: config
        },
        {
          provide: FORM_ERRORS,
          ...config.errors
        } as any
      ]
    };
  }
}
