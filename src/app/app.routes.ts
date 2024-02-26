import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'formula-editor',
        loadComponent: () => import('./formula-editor/formula-editor.component')
    },
    {
        path: '**',
        redirectTo: 'formula-editor',
        pathMatch: 'full'
    }
];
