import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { EditorService } from './editor.service';
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
                (keydown.enter)="preventDefault($event)"
            ></ngx-monaco-editor>
            <!-- display validation and error message after validation -->

            @if (editorService.isValid()) {
                <div class="formula-success">Validated</div>
            }
            @if (editorService.errMsg(); as err) {
                <div class="err-msg">{{ err }}</div>
            }
            <div class="btn-span">
                <button class="btn-cls" type="submit" (click)="compile()">Validate</button>
            </div>
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
            font-weight: bold;
            cursor: pointer;
            font-size: 15px;
            border-radius: 5px;
        }
        .formula-success {
            color: green;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            background-color: #f2f2f2;
            height: 30px;
            padding-top: 5px;
        }
        .err-msg {
            color: red;
            font-size: 20px;
            background-color: #f2f2f2;
            text-align: center;
            height: 30px;
            padding-top: 5px;
        }
    `,
    imports: [MonacoEditorModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Editor {
    editorService = inject(EditorService);
    // jsonCode = ['{', '    "p1": "v3",', '    "p2": false', '}'].join('\n');

    // model: NgxEditorModel = {
    //     value: this.jsonCode,
    //     language: 'json'
    // };

    code = signal('');
    editorOptions = { language: 'dsl', theme: 'myCoolTheme' };

    onInit(editor: any) {
        console.log('editor is ready:', editor);
        editor.focus();
    }

    compile() {
        if (!this.code().trim()) return;
        this.editorService.compileFormula(this.code());
    }

    preventDefault(event: Event) {
        event.preventDefault();
        this.compile();
    }
}
