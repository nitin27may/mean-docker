import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { map } from "rxjs/operators";
import { ContactService } from "./contact.service";

@Injectable()
export class ContactDetailsResolver implements Resolve<any> {
  constructor(private contactService: ContactService) {}

  resolve(route: ActivatedRouteSnapshot): any {
    return this.contactService.getById(route.paramMap.get("contactId")).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
}
