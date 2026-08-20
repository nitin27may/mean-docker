import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Notification, NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-notification-container',
    imports: [NgbToast],
    templateUrl: './notification-container.component.html',
    styleUrl: './notification-container.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationContainerComponent {
    private readonly notificationService = inject(NotificationService);

    readonly notifications = this.notificationService.notifications;

    onHidden(notification: Notification): void {
        this.notificationService.remove(notification);
    }

    classFor(notification: Notification): string {
        switch (notification.type) {
            case 'success':
                return 'bg-success text-light';
            case 'error':
                return 'bg-danger text-light';
            default:
                return 'bg-info text-light';
        }
    }
}
