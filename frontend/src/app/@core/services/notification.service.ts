import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    /** Milliseconds before the toast auto-dismisses. */
    delay: number;
}

/**
 * Application notifications, backed by a signal and rendered by
 * NotificationContainerComponent using ng-bootstrap's toasts.
 *
 * This replaced ngx-toastr, which has no Angular 22 release and imports
 * ComponentFactoryResolver, an API Angular 22 removed. ng-bootstrap was
 * already a dependency, so this drops one instead of adding one.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
    private nextId = 0;
    private readonly items = signal<Notification[]>([]);

    /** Read-only view for the container component. */
    readonly notifications = this.items.asReadonly();

    success(message: string, delay = 4000): void {
        this.push('success', message, delay);
    }

    error(message: string, delay = 6000): void {
        this.push('error', message, delay);
    }

    info(message: string, delay = 4000): void {
        this.push('info', message, delay);
    }

    remove(notification: Notification): void {
        this.items.update((items) => items.filter((item) => item.id !== notification.id));
    }

    clear(): void {
        this.items.set([]);
    }

    private push(type: NotificationType, message: string, delay: number): void {
        this.items.update((items) => [...items, { id: this.nextId++, type, message, delay }]);
    }
}
