import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-layout',
    imports: [
        RouterOutlet,
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
    ],
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './layout.component.css',
})
export class LayoutComponent {}
