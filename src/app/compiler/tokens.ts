import { createToken } from 'chevrotain';

export function createTokens() {
    const ADD = createToken({ name: 'ADD', pattern: /\+/ });
    const SUBTRACT = createToken({ name: 'SUBTRACT', pattern: /-/ });
    const MULTIPLY = createToken({ name: 'MULTIPLY', pattern: /\*/ });
    const DIVIDE = createToken({ name: 'DIVIDE', pattern: /\// });
    const LPAREN = createToken({ name: 'LPAREN', pattern: /\(/ });
    const RPAREN = createToken({ name: 'RPAREN', pattern: /\)/ });
    const NumberLiteral = createToken({ name: 'NUMBER', pattern: /[0-9]\d+/ });
    const WHITESPACE = createToken({
        name: 'WHITESPACE',
        pattern: /\s+/,
        group: 'whitespace',
        line_breaks: true
    });

    return [WHITESPACE, ADD, SUBTRACT, MULTIPLY, DIVIDE, LPAREN, RPAREN, NumberLiteral];
}
