import { CstNode, CstParser, IToken, TokenType } from 'chevrotain';
import {
    Age,
    Aggregate,
    ArithmeticOperator,
    Count,
    FilterBy,
    Identifier,
    Instant,
    LParen,
    Max,
    Min,
    MultiOperator,
    NumberLiteral,
    On,
    RParen,
    Salary,
    Sum,
    ValidUntil,
    allTokens
} from './lexer';

const customErrors = {
    buildMismatchTokenMessage(options: {
        expected: TokenType;
        actual: IToken;
        previous: IToken;
        ruleName: string;
    }): string {
        return ``;
    },
    buildNotAllInputParsedMessage(options: { firstRedundant: IToken; ruleName: string }): string {
        return `Redundant input, expecting EOF but found: ${options.firstRedundant.image}`;
    },
    buildNoViableAltMessage(options: {
        expectedPathsPerAlt: TokenType[][][];
        actual: IToken[];
        previous: IToken;
        customUserDescription?: string;
        ruleName: string;
    }): string {
        return 'No viable alternative';
    },
    buildEarlyExitMessage(options: {
        expectedIterationPaths: TokenType[][];
        actual: IToken[];
        previous: IToken;
        customUserDescription?: string;
        ruleName: string;
    }): string {
        return 'Early exit';
    }
};

export class ArithmeticExpressionParser extends CstParser {
    constructor() {
        super(
            allTokens
            //     {
            //     errorMessageProvider: customErrors
            // }
        );
        this.createRules();
    }

    // Example of a valid formula:
    // language 1: `on Employee validUntil instant filterBy(isActiveEmployee) aggregate count(Employee.EmployeeID)`
    // language 2: all types of arithmetic expression with addition, subtraction, multiplication, division, and parenthesis, age, salary keywords
    // language can start with language 1 or language 2
    declare expression: () => CstNode;

    createRules() {
        const T: any = this;

        T.RULE('expression', () => {
            T.OR([
                {
                    ALT: () => {
                        T.SUBRULE(T.additionExpression);
                    }
                },
                {
                    ALT: () => {
                        T.SUBRULE(T.onKey);
                    }
                }
            ]);
        });

        // Arithmetic expression rules START
        T.RULE('additionExpression', () => {
            T.SUBRULE(T.multiplicationExpression, { LABEL: 'lhs' });
            T.MANY(() => {
                T.CONSUME(ArithmeticOperator);
                T.SUBRULE2(T.multiplicationExpression, { LABEL: 'rhs' });
            });
        });

        T.RULE('multiplicationExpression', () => {
            T.SUBRULE(T.atomicExpression, { LABEL: 'lhs' });
            T.MANY(() => {
                T.CONSUME(MultiOperator);
                T.SUBRULE2(T.atomicExpression, { LABEL: 'rhs' });
            });
        });

        T.RULE('atomicExpression', () => {
            T.OR([
                { ALT: () => T.CONSUME(NumberLiteral) },
                { ALT: () => T.CONSUME(Age) },
                { ALT: () => T.CONSUME(Salary) },
                { ALT: () => T.SUBRULE2(T.parenthesisExpression) }
            ]);
        });

        T.RULE('parenthesisExpression', () => {
            T.CONSUME(LParen);
            T.SUBRULE(T.expression);
            T.CONSUME(RParen);
        });
        // Arithmetic expression rules END

        /**
         *
         * language 1: `on Employee count(Employee.EmployeeID)`
         * Starts with `on` keyword
         * Followed by an identifier
         * Followed by an optional `validUntil` keyword
         * Followed by an optional `instant` keyword
         * Followed by an optional `filterBy` keyword
         * Followed by an optional `aggregate` keyword
         * Followed by an optional `count`, `sum`, `min`, `max` keyword
         * on employee aggregate count(Employee.EmployeeID)
         * on employee filterBy(isActiveEmployee)  aggregate count(Employee.EmployeeID)
         * on employee validUntil instant   aggregate count(Employee.EmployeeID) filterBy(isActiveEmployee)
         * on employee validUntil instant aggregate count(Employee.EmployeeID)
         * on employee validUntil instant filterBy(isActiveEmployee) aggregate count(Employee.EmployeeID)
         */
        T.RULE('onKey', () => {
            T.CONSUME(On);
            T.CONSUME(Identifier);
            T.OPTION(() => {
                T.SUBRULE(T.optionalRule);
            });
            T.SUBRULE(T.minimumExpressionIsRequired);
            T.OPTION2(() => {
                T.SUBRULE2(T.optionalRule);
            });
        });

        T.RULE('minimumExpressionIsRequired', () => {
            T.SUBRULE(T.aggregateKey);
        });

        T.RULE('optionalRule', () => {
            T.OPTION(() => {
                T.SUBRULE(T.validUntilKey);
            });
            T.OPTION2(() => {
                T.SUBRULE(T.filterByFn);
            });
        });

        T.RULE('validUntilKey', () => {
            T.CONSUME(ValidUntil);
            T.CONSUME(Instant);
        });

        T.RULE('filterByFn', () => {
            T.CONSUME(FilterBy);
            T.CONSUME(LParen);
            T.CONSUME(Identifier);
            T.CONSUME(RParen);
        });

        T.RULE('aggregateKey', () => {
            T.CONSUME(Aggregate);
            T.SUBRULE(T.aggregateFns);
            T.CONSUME(LParen);
            T.CONSUME(Identifier);
            T.CONSUME(RParen);
        });

        T.RULE('aggregateFns', () => {
            T.OR([
                {
                    ALT: () => {
                        T.CONSUME(Count);
                    }
                },
                {
                    ALT: () => {
                        T.CONSUME(Sum);
                    }
                },
                {
                    ALT: () => {
                        T.CONSUME(Min);
                    }
                },
                {
                    ALT: () => {
                        T.CONSUME(Max);
                    }
                }
            ]);
        });

        T.performSelfAnalysis();
    }
}

export const parserInstance = new ArithmeticExpressionParser();
