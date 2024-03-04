import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { validateExpression } from '../compiler/arithmatic/transformer';
import { evaluateArithmeticExpression } from '../compiler/ts-arithmetic/transformer';

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
            (keydown.enter)="validateInput($event)"
        ></textarea>
        <button (click)="validateInput()">Validate</button>

        @if (response()?.error) {
            <div class="error">{{ response()?.error }}</div>
        } @else if (response()?.value !== null) {
            <div class="value">Output: {{ response()?.value }}</div>
        }
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
        .error {
            color: red;
            margin-top: 10px;
            text-align: center;
            font-size: 20px;
        }
        .value {
            color: green;
            margin-top: 10px;
            text-align: center;
            font-size: 20px;
        }
    `,
    imports: [FormsModule]
})
export default class FormulaEditor {
    formula = '';
    response = signal<{ value: number | null; error: string | null } | null>(null);

    validateInput($event?: Event) {
        $event?.preventDefault();
        if (!this.formula.trim()) return;
        const { value, error } = evaluateArithmeticExpression(this.formula);
        this.response.set({ value, error });
    }
}
