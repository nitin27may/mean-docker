import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { AlertModule } from "ngx-bootstrap/alert";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    TypeaheadModule.forRoot(),
    ButtonsModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  exports: [
    TabsModule,
    BsDropdownModule,
    TooltipModule,
    ModalModule,
    CollapseModule,
    TypeaheadModule,
    AlertModule,
    ButtonsModule,
    TimepickerModule
  ]
})
export class BootstrapModule {}
