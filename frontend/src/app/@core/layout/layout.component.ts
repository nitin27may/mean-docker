import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './layout.component.css',
})
export class LayoutComponent {}
