import { Lexer } from 'chevrotain';
import { allTokens } from './tokens';

export function lexerTokens(input) {
    const arithmeticLexer = new Lexer(allTokens);
    const lexerResult = arithmeticLexer.tokenize(input);
    return lexerResult;
}
