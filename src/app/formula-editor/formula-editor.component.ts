import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parsePure } from '../compiler/grammer';

@Component({
    selector: 'app-formula-editor',
    standalone: true,
    template: `
        <textarea
            placeholder="Enter a formula"
            rows="10"
            cols="50"
            [(ngModel)]="formula"
            name="formula"
            autofocus
            id="formula"
            required
            (keyup.enter)="validateInput()"
        ></textarea>
        <button (click)="validateInput()">Validate</button>
    `,
    styles: `
        textarea {
            display: block;
            margin: 0 auto;
            width: 100%;
            max-width: 500px;
            border: 1px solid #ccc;
            font-size: 16px;
            padding: 10px;
            box-sizing: border-box;
            radius: 10px;
        }
        button {
            display: block;
            margin-top: 10px;
            margin-left: auto;
            margin-right: auto;
            padding: 10px 20px;
            font-size: 16px;
        }
    `,
    imports: [FormsModule],
})
export default class FormulaEditor {
    formula = '';

    validateInput() {
        console.log(parsePure(this.formula));
    }
}
