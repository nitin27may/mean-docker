import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { AlertModule } from "ngx-bootstrap/alert";

@NgModule({
    imports: [
        CommonModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        CollapseModule.forRoot(),
        TypeaheadModule.forRoot()
    ],
    exports: [BsDropdownModule, TooltipModule, ModalModule, CollapseModule, TypeaheadModule, AlertModule]
})
export class BootstrapModule { }
