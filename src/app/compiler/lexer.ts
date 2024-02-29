import { Lexer, TokenType } from 'chevrotain';

export function createLexer(tokens: TokenType[], inputText: string) {
    try {
        const FormulaLexer = new Lexer(tokens);
        const lexingResult = FormulaLexer.tokenize(inputText);

        if (lexingResult.errors.length > 0) {
            console.log('lexingResult.errors -->', lexingResult.errors);
            throw new Error('Invalid input:');
        }

        return lexingResult;
    } catch (error) {
        throw error;
    }
}
