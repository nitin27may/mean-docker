import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AlertService } from "./alert-messages.service";

@Component({
  selector: "app-alert",
  templateUrl: "alert-messages.component.html"
})
export class AlertComponent implements OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) {
    // subscribe to alert messages
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  ngOnDestroy(): void {
    // unsubscribe on destroy to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
