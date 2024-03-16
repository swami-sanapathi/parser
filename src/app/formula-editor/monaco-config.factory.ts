import { HttpClient } from '@angular/common/http';
import { EditorService } from './editor.service';

declare const monaco: any;
export const monacoConfigFactory = (http: HttpClient, service: EditorService) => {
    return {
        onMonacoLoad: () => {
            monaco.languages.register({ id: 'mySpecialLanguage' });
            monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
                tokenizer: {
                    root: [
                        [/\b(?:true|false)\b/, 'keyword'],
                        [/\b(?:p1|p2)\b/, 'type'],
                        [/\b(?:[a-zA-Z_]\w*)\b/, 'identifier'],
                        [/\b(?:[0-9]+)\b/, 'number']
                    ]
                }
            });
            monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
                provideCompletionItems: async () => {
                    const { keywords, operators } = await service.getKeywords();
                    return {
                        suggestions: [
                            ...keywords.map((keyword) => ({
                                label: keyword.name,
                                insertText: keyword.name, // Add this line
                                kind: monaco.languages.CompletionItemKind.Keyword
                            })),
                            ...operators.map((operator) => ({
                                label: operator.name,
                                insertText: operator.name, // Add this line
                                kind: monaco.languages.CompletionItemKind.Operator
                            }))
                        ]
                    };
                }
            });
            // define colors
            monaco.editor.defineTheme('myCoolTheme', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
                    { token: 'type', foreground: '008800' },
                    { token: 'identifier', foreground: 'FF0000' },
                    { token: 'number', foreground: '0000FF' }
                ],
                colors: { 'editor.foreground': '#000000', 'editor.background': '#EDF1F7' }
            });
        }
    };
};
