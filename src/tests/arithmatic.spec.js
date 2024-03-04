// import { Lexer } from 'chevrotain';
// import { arithmeticParser } from '../app/compiler/arithmatic/parser';
// import { lexerTokens } from '../app/compiler/arithmatic/lexer';

// add tests that tests the transformer and parser
// const lexResult = Lexer.tokenize(input);

describe('Arithmetic Parser', () => {
    // it('should parse the expression', () => {
    //     const lexerResult = lexerTokens(input);
    //     arithmeticParser.input = lexerResult.tokens;
    //     const cst = parser.expression();
    //     expect(cst).toBeDefined('The parser should parse the expression and return a concrete syntax tree');
    // });
    it('should add two numbers', () => {
       const result = add(2, 3);
         expect(result).toBe(5);
    });
});


function add (a, b) {
    return a + b;
}