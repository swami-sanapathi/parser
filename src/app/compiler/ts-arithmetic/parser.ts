import { CstParser, CstNode } from "chevrotain";
import { ArithmeticOperator, LParen, MultiOperator, Multiply, NumberLiteral, RParen, allTokens } from "./lexer";

export class ArithmeticExpressionParser extends CstParser {
    constructor() {
        super(allTokens);
        this.createRules();
    }

    declare expression: () => CstNode;

    createRules() {
        const T: any = this;

        T.RULE("expression", () => {
            T.SUBRULE(T.additionExpression);
        });

        T.RULE("additionExpression", () => {
            T.SUBRULE(T.multiplicationExpression, { LABEL: "lhs" });
            T.MANY(() => {
                T.CONSUME(ArithmeticOperator);
                T.SUBRULE2(T.multiplicationExpression, { LABEL: "rhs" });
            });

        });

        T.RULE("multiplicationExpression", () => {
            T.SUBRULE(T.atomicExpression, { LABEL: "lhs" });
            T.MANY(() => {
                T.CONSUME(MultiOperator);
                T.SUBRULE2(T.atomicExpression, { LABEL: "rhs" });
            }
            );
        }
        );


        T.RULE("atomicExpression", () => {
            T.OR([
                { ALT: () => T.CONSUME(NumberLiteral) },
                { ALT: () => T.SUBRULE(T.parenthesisExpression) }
            ]);
        });

        T.RULE("parenthesisExpression", () => {
            T.CONSUME(LParen);
            T.SUBRULE(T.expression);
            T.CONSUME(RParen);
        });


        T.performSelfAnalysis();
    }
}

export const parserInstance = new ArithmeticExpressionParser();
