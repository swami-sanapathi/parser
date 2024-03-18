import { HttpClient } from '@angular/common/http'; // Import for making HTTP requests
import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
declare const monaco: any; // Assuming global declaration
interface KeywordOperatorData {
    keywords: { name: string }[];
    operators: { name: string }[];
}
const monacoConfigFactory = () => {
    return {
        onMonacoLoad: async () => {
            const http = inject(HttpClient);
            let data: KeywordOperatorData = { keywords: [], operators: [] };
            http.get<KeywordOperatorData>('http://localhost:3001/api/editor/keywords').subscribe((res) => {
                data = res;
            });

            // Register the custom language with Monaco
            monaco.languages.register({ id: 'mySpecialLanguage' });

            // Construct the tokenizer dynamically based on fetched keywords and operators
            const tokenizer = {
                root: [
                    ...data.keywords.map((keyword) => new RegExp(`\\[${keyword.name}\\]`, 'i')), // Case-insensitive matching using `i` flag
                    ...data.operators.map((operator) => new RegExp(operator.name, 'i')) // Case-insensitive matching
                ]
            };

            // Set up the Monaco language configuration
            monaco.languages.setMonarchTokensProvider('mySpecialLanguage', { tokenizer });

            // Define the custom theme (can be moved to a separate function for reusability)
            monaco.editor.defineTheme('myCoolTheme', {
                base: 'vs',
                inherit: false,
                rules: [
                    { token: 'custom-info', foreground: '808080' },
                    { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
                    { token: 'custom-notice', foreground: 'FFA500' },
                    { token: 'custom-date', foreground: '008800' }
                ],
                colors: {
                    'editor.foreground': '#000000',
                    'editor.background': '#EDF1F5'
                }
            });

            // Register completion item provider (can be further enhanced based on fetched keywords)
            monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
                provideCompletionItems(model: any, position: any) {
                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    // Simplified completion suggestions based on fetched keywords (example)
                    const suggestions = data.keywords
                        .filter((keyword) => keyword.name.startsWith(word))
                        .map((keyword) => ({
                            label: keyword.name,
                            kind: monaco.languages.CompletionItemKind.Text,
                            insertText: keyword.name,
                            range: range
                        }));

                    return { suggestions };
                }
            });
        }
    };
};

// Route configuration with providers for loading Monaco and dynamic config
export const routes: Routes = [
    {
        path: 'editor',
        loadComponent: () => import('./formula-editor/editor.component'),
        providers: [
            importProvidersFrom(MonacoEditorModule.forRoot(monacoConfigFactory())),
            { provide: HttpClient, useClass: HttpClient }
        ]
    },
    {
        path: '**',
        redirectTo: 'editor',
        pathMatch: 'full'
    }
];
