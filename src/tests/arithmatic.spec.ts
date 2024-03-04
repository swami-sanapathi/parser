// import { Lexer } from 'chevrotain';
// import { arithmeticParser } from '../app/compiler/arithmatic/parser';
// import { lexerTokens } from '../app/compiler/arithmatic/lexer';

// add tests that tests the transformer and parser
// const lexResult = Lexer.tokenize(input);

describe('Arithmetic Parser', () => {
    it('should add two numbers', () => {
        const result = add(2, 3);
        expect(result).toBe(5);
    });
});


function add(a: number, b: number) {
    return a + b;
}