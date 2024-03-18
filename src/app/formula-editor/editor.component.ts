import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
declare const monaco: any;

@Component({
    selector: 'editor',
    standalone: true,
    template: `
        <div class="container">
            <h2>Editor</h2>
            <ngx-monaco-editor
                [(ngModel)]="code"
                [options]="editorOptions"
                (onInit)="onInit($event)"
            ></ngx-monaco-editor>
            <span class="btn-span">
                <button class="btn-cls" type="submit" (click)="getCode()">Validate</button>
            </span>
        </div>
    `,
    styles: `
        .container {
            height: 100%;
            width: 50%;
            margin-left: 25%;
            margin-top: 5%;
        }
        .btn-span {
            display: flex;
            justify-content: right;
            margin-top: 10px;
        }
        .btn-cls {
            background-color: #4caf50;
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            font-size: 15px;
            border-radius: 5px;
        }
    `,
    imports: [MonacoEditorModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Editor {
    // jsonCode = ['{', '    "p1": "v3",', '    "p2": false', '}'].join('\n');

    // model: NgxEditorModel = {
    //     value: this.jsonCode,
    //     language: 'json'
    // };

    code = signal('');
    editorOptions = { language: 'dsl', theme: 'myCoolTheme'};

    onInit(editor: any) {
        console.log('editor is ready:', editor);
        editor.focus();
    }

    getCode() {
        console.log('code --->', this.code());
    }
}
