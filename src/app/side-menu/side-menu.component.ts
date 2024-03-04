import { Component } from '@angular/core';

@Component({
    selector: 'app-side-menu',
    standalone: true,
    template: `
        <!-- <div class="side-menu">
            <ul>
                <li><a (click)="changeParser('a')">Arithmetic</a></li>
                <li><a (click)="changeParser('j')">JSON</a></li>
                <li><a (click)="changeParser('s')">SQL</a></li>
            </ul>
        </div> -->
    `,
    styles: `
        .side-menu {
            width: 200px;
            background: #f4f4f4;
            padding: 10px;
            box-sizing: border-box;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin-bottom: 10px;
            background: #fff;
            cursor: pointer;
            padding: 10px;
        }
        a {
            text-decoration: none;
            color: #333;
        }
        a.active {
            font-weight: bold;
        }
    `,
})
export class SideMenuComponent {
    changeParser(parser: 'a' | 'j' | 's') {}
}
