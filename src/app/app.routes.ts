import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { EditorService } from './formula-editor/editor.service';
import { monacoConfigFactory } from './formula-editor/monaco-config.factory';

export const routes: Routes = [
    {
        path: 'editor',
        loadComponent: () => import('./formula-editor/editor.component'),
        providers: [
            EditorService,
            importProvidersFrom(MonacoEditorModule),
            {
                provide: NGX_MONACO_EDITOR_CONFIG,
                useFactory: monacoConfigFactory,
                deps: [HttpClient, EditorService]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'editor',
        pathMatch: 'full'
    }
];
