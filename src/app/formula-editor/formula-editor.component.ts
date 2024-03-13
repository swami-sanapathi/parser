import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { evaluateArithmeticExpression } from '../compiler/arithmetic/transformer';

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
            <div class="error">Error: {{ response()?.error }}</div>
        } @else if (response()?.value !== null) {
            <div class="value">Valid formula.</div>
            <!-- <div class="value">Output: {{ response()?.value }}</div> -->
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
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 10px;
            width: 50%;
            margin-top: 20px;
            margin-left: auto;
            margin-right: auto;
        }
        .value {
            text-align: center;
            color: green;
            margin-top: 10px;
            font-size: 20px;
            background-color: #ccc;
            padding: 10px;
            border-radius: 10px;
            width: 50%;
            margin-top: 20px;
            margin-left: auto;
            margin-right: auto;
        }
    `,
    imports: [FormsModule]
})
export default class FormulaEditor {
    formula = '';
    response = signal<{ value: number | null; error: string | null } | null>(null);
    private http = inject(HttpClient);

    validateInput($event?: Event) {
        $event?.preventDefault();
        if (!this.formula.trim()) return;
        const { value, error } = evaluateArithmeticExpression(this.formula);

        this.response.set({ value, error });
        if (value && typeof value === 'object') {
            this.http.post('http://localhost:3000/api/query', { formula: value }).subscribe((res) => {
                console.log(res);
            });
        }
    }
}
