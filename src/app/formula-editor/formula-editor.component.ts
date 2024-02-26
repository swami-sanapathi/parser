import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
            id="formula"
            required
        ></textarea>
        <button (click)="validateFormula()">Validate</button>
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
    imports: [FormsModule]
})
export default class FormulaEditor {
    formula = '';

    /**
     * create compiler (or) interpreter in javascript to validate and convert the given input to the desired output
     * input: string --> "1 + 2 * 3"
     * output: number --> 7
     * input: string --> "leaf_node + 1", {leaf_node: 6}
     * output: number --> 7
     */
    tokenizer(input: string) {
        // validate the input 1+1
        // convert the input to tokens
        let current = 0;
        const tokens = [];
        while (current < input.length) {
            let char = input[current];
            if (char === '+') {
                tokens.push({ type: 'PLUS', value: '+' });
                current++;
                continue;
            }
            if (char === '-') {
                tokens.push({ type: 'MINUS', value: '-' });
                current++;
                continue;
            }
            if (char === '*') {
                tokens.push({ type: 'MULTIPLY', value: '*' });
                current++;
                continue;
            }
            if (char === '/') {
                tokens.push({ type: 'DIVIDE', value: '/' });
                current++;
                continue;
            }

            const WHITESPACE = /\s/;
            if (WHITESPACE.test(char)) {
                current++;
                continue;
            }

            const NUMBERS = /[0-9]/;
            if (NUMBERS.test(char)) {
                let value = '';
                while (NUMBERS.test(char)) {
                    value += char;
                    char = input[++current];
                }
                tokens.push({ type: 'NUMBER', value });
                continue;
            }
            throw new TypeError(`I don't know what this character is: ` + char);
        }
        return tokens;
    }

    validateFormula() {
        try {
            console.log('returns: --> ', this.tokenizer(this.formula));
        } catch (error: unknown) {
            prompt('Invalid input: ', this.formula);
        }
    }
}
