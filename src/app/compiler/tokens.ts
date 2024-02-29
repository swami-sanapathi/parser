import { createToken } from 'chevrotain';


export const ADD = createToken({ name: 'ADD', pattern: /\+/ });
export const SUBTRACT = createToken({ name: 'SUBTRACT', pattern: /-/ });
export const MULTIPLY = createToken({ name: 'MULTIPLY', pattern: /\*/ });
export const DIVIDE = createToken({ name: 'DIVIDE', pattern: /\// });
export const LPAREN = createToken({ name: 'LPAREN', pattern: /\(/ });
export const RPAREN = createToken({ name: 'RPAREN', pattern: /\)/ });
export const NumberLiteral = createToken({ name: 'NUMBER', pattern: /[0-9]\d+/ });
export const WHITESPACE = createToken({
    name: 'WHITESPACE',
    pattern: /\s+/,
    group: 'whitespace',
    line_breaks: true
});

export const allTokens = [WHITESPACE, ADD, SUBTRACT, MULTIPLY, DIVIDE, LPAREN, RPAREN, NumberLiteral];


