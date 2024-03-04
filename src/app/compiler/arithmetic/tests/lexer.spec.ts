import { lexer } from '../lexer';
import { tokenizeInput } from '../transformer';

describe('lexer tests', () => {
    it('should tokenize a simple expression', () => {
        const input = '2 + 3';

        const tokens = tokenizeInput(input).tokens;
        expect(tokens).toMatchObject([
            { image: '2', startOffset: 0, endOffset: 0, tokenType: { name: 'NumberLiteral' } },
            { image: '+', startOffset: 2, endOffset: 2, tokenType: { name: 'Add' } },
            { image: '3', startOffset: 4, endOffset: 4, tokenType: { name: 'NumberLiteral' } },
        ]);
    });

    it('should tokenize a complex expression', () => {
        const input = '2 + 3 * 4';

        const tokens = tokenizeInput(input).tokens;
        expect(tokens).toMatchObject([
            { image: '2', startOffset: 0, endOffset: 0, tokenType: { name: 'NumberLiteral' } },
            { image: '+', startOffset: 2, endOffset: 2, tokenType: { name: 'Add' } },
            { image: '3', startOffset: 4, endOffset: 4, tokenType: { name: 'NumberLiteral' } },
            { image: '*', startOffset: 6, endOffset: 6, tokenType: { name: 'Multiply' } },
            { image: '4', startOffset: 8, endOffset: 8, tokenType: { name: 'NumberLiteral' } },
        ]);
    });

    it('should tokenize a complex expression with parenthesis', () => {
        const input = '(2+(3*4))/5';
        const tokens = tokenizeInput(input).tokens;
        expect(tokens).toMatchObject([
            { image: '(', startOffset: 0, endOffset: 0, tokenType: { name: 'LParen' } },
            { image: '2', startOffset: 1, endOffset: 1, tokenType: { name: 'NumberLiteral' } },
            { image: '+', startOffset: 2, endOffset: 2, tokenType: { name: 'Add' } },
            { image: '(', startOffset: 3, endOffset: 3, tokenType: { name: 'LParen' } },
            { image: '3', startOffset: 4, endOffset: 4, tokenType: { name: 'NumberLiteral' } },
            { image: '*', startOffset: 5, endOffset: 5, tokenType: { name: 'Multiply' } },
            { image: '4', startOffset: 6, endOffset: 6, tokenType: { name: 'NumberLiteral' } },
            { image: ')', startOffset: 7, endOffset: 7, tokenType: { name: 'RParen' } },
            { image: ')', startOffset: 8, endOffset: 8, tokenType: { name: 'RParen' } },
            { image: '/', startOffset: 9, endOffset: 9, tokenType: { name: 'Divide' } },
            { image: '5', startOffset: 10, endOffset: 10, tokenType: { name: 'NumberLiteral' } },
        ]);
    });

    it('should tokenize a complex expression with parenthesis and whitespace', () => {
        const input = '2 + ( 3 * 4 )';

        const tokens = tokenizeInput(input).tokens;
        expect(tokens).toMatchObject([
            { image: '2', startOffset: 0, endOffset: 0, tokenType: { name: 'NumberLiteral' } },
            { image: '+', startOffset: 2, endOffset: 2, tokenType: { name: 'Add' } },
            { image: '(', startOffset: 4, endOffset: 4, tokenType: { name: 'LParen' } },
            { image: '3', startOffset: 6, endOffset: 6, tokenType: { name: 'NumberLiteral' } },
            { image: '*', startOffset: 8, endOffset: 8, tokenType: { name: 'Multiply' } },
            { image: '4', startOffset: 10, endOffset: 10, tokenType: { name: 'NumberLiteral' } },
            { image: ')', startOffset: 12, endOffset: 12, tokenType: { name: 'RParen' } },
        ]);
    });

    it('should throw an error for invalid input', () => {
        const input = '2 + 3 * 4 + a';
        const lexerResult = tokenizeInput(input);
        expect(lexerResult.error).toBe('unexpected character: ->a<- at offset: 12, skipped 1 characters.');
    });
});
