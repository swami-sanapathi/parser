import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "./side-menu/side-menu.component";

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <app-side-menu/>
    <router-outlet />`,
    imports: [RouterOutlet, SideMenuComponent]
})
export class AppComponent { }
