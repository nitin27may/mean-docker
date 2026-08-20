import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './@core/components/notification/notification-container.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        CommonModule,
        NotificationContainerComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = 'contacts';
}
