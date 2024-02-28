import { CstParser } from 'chevrotain';
import { createTokens } from './tokens';

export class Arithmetic extends CstParser {
    // constructor() {
    //     super(createTokens());
    //     const $ = this;
    //     this.performSelfAnalysis();
    //     $.RULE('expression', () => {
    //         $.SUBRULE($.additionExpression);
    //     });
    //     $.RULE('additionExpression', () => {
    //         $.SUBRULE($.multiplicationExpression);
    //         $.MANY(() => {
    //             $.CONSUME(ADD);
    //             $.SUBRULE2($.multiplicationExpression);
    //         });
    //     });
    // }
}
