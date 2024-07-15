import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        CommonModule,
        RouterLink,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
})
export class LayoutComponent {}
