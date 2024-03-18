import { EditorService } from './editor.service';

declare const monaco: any;
export const monacoConfigFactory = (editorService: EditorService) => {
    return {
        onMonacoLoad: async () => {
            const { keywords, operators, attributes } = await editorService.getKeywords();
            console.log({ keywords, operators, attributes });
            const keywordsRegex = keywords.map((keyword) => `\\b${keyword.name}\\b`).join('|');
            const operatorsRegex = operators.map((operator) => `\\b${operator.name}\\b`).join('|');
            const attributesRegex = attributes.map((attribute) => `\\b${attribute.name}\\b`).join('|');

            monaco.languages.register({ id: 'dsl' });
            monaco.languages.setMonarchTokensProvider('dsl', {
                ignoreCase: true,
                tokenizer: {
                    root: [
                        [new RegExp(keywordsRegex), 'keyword'],
                        [new RegExp(operatorsRegex), 'operator'],
                        [new RegExp(attributesRegex), 'attributes'],
                        [/\b(?:[a-zA-Z_]\w*)\b/, 'identifier'],
                        [/\b(?:[0-9]+)\b/, 'number']
                    ]
                }
            });
            monaco.languages.setLanguageConfiguration('dsl', {
                brackets: [['(', ')']]
            });
            monaco.languages.registerCompletionItemProvider('dsl', {
                provideCompletionItems: async () => {
                    return {
                        suggestions: [
                            ...keywords.map((keyword) => ({
                                label: keyword.name,
                                insertText: keyword.name,
                                kind: monaco.languages.CompletionItemKind.Keyword
                            })),
                            ...operators.map((operator) => ({
                                label: operator.name,
                                insertText: operator.name,
                                kind: monaco.languages.CompletionItemKind.Operator
                            })),
                            ...attributes.map((attribute) => ({
                                label: attribute.name,
                                insertText: attribute.name,
                                kind: monaco.languages.CompletionItemKind.Value
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
                    { token: 'keyword', foreground: '0000FF' },
                    { token: 'operator', foreground: 'FF0000' },
                    { token: 'attributes', foreground: 'FF00FF' },
                    { token: 'identifier', foreground: '000000' },
                    { token: 'number', foreground: '0000FF' }
                ],
                colors: { 'editor.foreground': '#000000', 'editor.background': '#EDF1F7' }
            });
            monaco.editor.setTheme('myCoolTheme');
        }
    };
};
