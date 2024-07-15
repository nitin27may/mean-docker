import { inject } from '@angular/core';
import { ContactService } from "./contact.service";
import { ResolveFn } from '@angular/router';

// export class ContactDetailsResolver  {
//   constructor(private contactService: ContactService) {}

//   export const userDetailsResolver: ResolveFn<UserDetails> = (route, state) => {
//     let userService = inject(UserService);
//     return userService.getUserDetails(+route.paramMap.get('id'));
//   };

//   // resolve(route: ActivatedRouteSnapshot): any {
//   //   return this.contactService.getById(route.paramMap.get("contactId")).pipe(
//   //     map((result: any) => {
//   //       return result;
//   //     })
//   //   );
//   // }
// }
export const ContactDetailsResolver: ResolveFn<any> = (route, state) => {
  let userService = inject(ContactService);
  return userService.getById(route.paramMap.get('contactId'));
};
