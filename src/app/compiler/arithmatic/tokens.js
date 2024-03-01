import { createToken, Lexer } from 'chevrotain';

export const AdditionOperator = createToken({ name: 'AdditionOperator', pattern: Lexer.NA });
export const MultiplyOperator = createToken({ name: 'MultiplyOperator', pattern: Lexer.NA });

export const Add = createToken({ name: 'Add', pattern: /\+/, categories: AdditionOperator });
export const Subtract = createToken({ name: 'Subtract', pattern: /-/, categories: AdditionOperator });
export const Multi = createToken({ name: 'Multi', pattern: /\*/, categories: MultiplyOperator });
export const Div = createToken({ name: 'Div', pattern: /\//, categories: MultiplyOperator });
export const Whitespace = createToken({ name: 'Whitespace', pattern: /\s+/, group: Lexer.SKIPPED });
export const NumberLiteral = createToken({
    name: 'NumberLiteral',
    pattern: /[1-9]\d*/
});
export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });

export const allTokens = [
    Whitespace,
    AdditionOperator,
    MultiplyOperator,
    Add,
    Subtract,
    NumberLiteral,
    Multi,
    Div,
    LParen,
    RParen
];
