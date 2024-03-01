import { CstParser } from 'chevrotain';
import { allTokens, AdditionOperator, NumberLiteral, MultiplyOperator, LParen, RParen } from './tokens';

class ArithmeticParser extends CstParser {
    constructor() {
        super(allTokens);
        const $ = this;

        $.RULE('expression', () => {
            $.SUBRULE($.mul);
        });

        $.RULE('mul', () => {
            $.SUBRULE($.add, { LABEL: 'lhs' });
            $.MANY(() => {
                $.CONSUME(MultiplyOperator);
                $.SUBRULE2($.add, { LABEL: 'rhs' });
            });
        });

        $.RULE('add', () => {
            $.SUBRULE($.atomic);
            $.MANY(() => {
                $.CONSUME(AdditionOperator);
                $.SUBRULE2($.atomic, { LABEL: 'rhs' });
            });
        });

        $.RULE('atomic', () => {
            $.OR([
                {
                    ALT: () => $.SUBRULE($.parens)
                },
                {
                    ALT: () => $.CONSUME(NumberLiteral)
                }
            ]);
        });

        $.RULE('parens', () => {
            $.CONSUME(LParen);
            $.SUBRULE($.expression);
            $.CONSUME(RParen);
        });

        $.performSelfAnalysis();
    }
}

export const arithmeticParser = new ArithmeticParser();
