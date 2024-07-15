import {
    Component,
    Inject,
    PLATFORM_ID,
    ViewEncapsulation,
} from '@angular/core';
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
    name = 'Contacts';
    angular = environment.angular;
    bootstrap = environment.bootstrap;
    expressjs = environment.expressjs;
    mongoDb = environment.mongoDb;

    constructor(@Inject(PLATFORM_ID) private platformId: object) {}
}
