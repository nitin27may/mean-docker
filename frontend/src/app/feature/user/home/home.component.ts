import {
    ChangeDetectionStrategy,
    Component,
    inject,
    PLATFORM_ID,
    ViewEncapsulation,
} from '@angular/core';
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    private readonly platformId = inject(PLATFORM_ID);

    name = 'Contacts';
    angular = environment.angular;
    bootstrap = environment.bootstrap;
    expressjs = environment.expressjs;
    mongoDb = environment.mongoDb;
}
