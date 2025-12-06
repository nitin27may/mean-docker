import {
    ChangeDetectionStrategy,
    Component,
    inject,
    PLATFORM_ID,
    ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'app-home',
    imports: [RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    private readonly platformId = inject(PLATFORM_ID);

    name = 'Contact Manager';
    angular = environment.angular;
    bootstrap = environment.bootstrap;
    expressjs = environment.expressjs;
    mongoDb = environment.mongoDb;

    technologies = [
        {
            icon: 'fa-brands fa-angular',
            name: 'Angular 21',
            description: 'Modern frontend framework with signals, standalone components, and SSR support.',
            color: '#dd0031'
        },
        {
            icon: 'fa-brands fa-node-js',
            name: 'Express.js',
            description: 'Fast, unopinionated, minimalist web framework for Node.js REST APIs.',
            color: '#339933'
        },
        {
            icon: 'fa-solid fa-database',
            name: 'MongoDB',
            description: 'Document database with the scalability and flexibility for modern applications.',
            color: '#47a248'
        },
        {
            icon: 'fa-brands fa-node',
            name: 'Node.js',
            description: 'JavaScript runtime built on Chrome\'s V8 engine for server-side applications.',
            color: '#339933'
        },
        {
            icon: 'fa-brands fa-docker',
            name: 'Docker',
            description: 'Containerization platform for consistent development and deployment.',
            color: '#2496ed'
        },
        {
            icon: 'fa-brands fa-bootstrap',
            name: 'Bootstrap 5',
            description: 'Modern CSS framework for responsive and mobile-first web development.',
            color: '#7952b3'
        }
    ];
}
