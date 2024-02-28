import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OPERATORS } from '../const/operators';
import { CstParser, Lexer, createToken } from 'chevrotain';
import { createTokens } from '../compiler/tokens';
import { createLexer } from '../compiler/lexer';
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
        <button (click)="validateExpression()">Validate</button>
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

    validateExpression() {
        try {
            const tokens = createTokens();
            const lexer = createLexer(tokens, this.formula);
            console.log('lexer result -->', lexer);
        } catch (error) {
            prompt((error as Error).message, this.formula);
        }
    }
}
