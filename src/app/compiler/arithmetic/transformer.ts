import { tokenMatcher } from 'chevrotain';
import { Add, Multiply, lexer } from './lexer';
import { parserInstance as parser } from './parser';

const CstVisitor = parser.getBaseCstVisitorConstructor();
interface IQueryOptions {
    select?: boolean;
    from: string;
    aggregateOpts?: {
        count: boolean;
        sum: boolean;
        max: boolean;
        min: boolean;
        avg: boolean;
    };
    aggregate?: boolean;
    aggregationColumn?: string;
    validUntil?: boolean;
    where?: boolean;
    whereOpts?: {
        identifier: string;
    } | null;
    validUntilOpts?: {
        validUntilOpts: null;
    } | null;
}
export default class ArithmeticCstVisitor extends CstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    expression(ctx: any) {
        if (ctx.additionExpression) {
            return this.visit(ctx.additionExpression);
        }
        return this.visit(ctx.onKey);
    }

    additionExpression(ctx: any) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs?.length) {
            ctx.rhs.forEach((rhs: any, index: number) => {
                const operator = ctx.ArithmeticOperator[index];
                const rhsValue = this.visit(rhs);
                if (tokenMatcher(operator, Add)) {
                    result += rhsValue;
                } else {
                    result -= rhsValue;
                }
            });
        }
        return result;
    }

    multiplicationExpression(ctx: any) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs?.length) {
            ctx.rhs.forEach((rhs: any, index: number) => {
                const operator = ctx.MultiOperator[index];
                const rhsValue = this.visit(rhs);
                if (tokenMatcher(operator, Multiply)) {
                    result *= rhsValue;
                } else {
                    result /= rhsValue;
                }
            });
        }
        return result;
    }

    atomicExpression(ctx: any) {
        if (ctx.NumberLiteral) {
            return parseInt(ctx.NumberLiteral[0].image, 10);
        } else if (ctx.Age) {
            return 25;
        } else if (ctx.Salary) {
            return 100;
        } else if (ctx.parenthesisExpression) {
            return this.visit(ctx.parenthesisExpression);
        }
    }

    parenthesisExpression(ctx: any) {
        return this.visit(ctx.expression);
    }

    onKey(ctx: any) {
        let queryOptions: IQueryOptions = {
            from: ctx.Identifier[0].image // TODO: check identifier is available in the database
        };

        if (ctx.minExp) {
            const minExpOpts = this.visit(ctx.minExp);
            queryOptions = { ...queryOptions, ...minExpOpts };
        }

        if (ctx.opt1) {
            const opts1 = this.visit(ctx.opt1);
            queryOptions = opts1 ? { ...queryOptions, ...opts1 } : queryOptions;
        }

        if (ctx.opt2) {
            const opts2 = this.visit(ctx.opt2);
            queryOptions = opts2 ? { ...queryOptions, ...opts2 } : queryOptions;
        }

        /**
          {
            "select": true,
            "table": "Employee",
            "aggregateOpts": {
                "count": true,
                "sum": false,
                "max": false,
                "min": false,
                "avg": false
            },
            "aggregate": false,
            "aggregationColumn": "Employee.EmployeeID",
            "validUntil": true,
            "where": true,
            "whereOpts": {
                "whereOpts": "isActiveEmployee"
            },
            "validUntilOpts": {
                "validUntilOpts": null
            }
        }
         */

        // prepare query like this `SELECT COUNT(Employee.EmployeeID) FROM Employee WHERE isActiveEmployee` from the above object
        return queryOptions;
    }

    minimumExpressionIsRequired(ctx: any) {
        const response = this.visit(ctx.aggregation);
        return response;
    }

    optionalRules(ctx: any) {
        if (ctx && Object.keys(ctx).length === 0) return null;

        const opts = { validUntil: false, where: false, whereOpts: null, validUntilOpts: null };
        if (ctx.filterByFn) {
            opts.where = true;
            opts.whereOpts = this.visit(ctx.filterByFn);
        }

        if (ctx.validUntilKey) {
            opts.validUntil = true;
            opts.validUntilOpts = this.visit(ctx.validUntilKey);
        }

        return opts;
    }

    validUntilKey(ctx: any) {
        return { validUntilOpts: null };
    }

    filterByFn(ctx: any) {
        const opts = {};
        if (ctx.Identifier?.length) {
            // TODO: check identifier is available in the database
            return { identifier: ctx.Identifier[0].image };
        }
        return opts;
    }

    aggregation(ctx: any) {
        const aggregateOpts = this.visit(ctx.aggregateFns);
        const aggregationColumn = ctx.Identifier[0].image;
        return { aggregateOpts, aggregate: true, aggregationColumn };
    }

    aggregateFns(ctx: any) {
        const aggregateFnsOpts = { count: false, sum: false, max: false, min: false, avg: false };
        if (ctx.Count) {
            aggregateFnsOpts.count = true;
        } else if (ctx.Sum) {
            aggregateFnsOpts.sum = true;
        } else if (ctx.Max) {
            aggregateFnsOpts.max = true;
        } else if (ctx.Min) {
            aggregateFnsOpts.min = true;
        } else if (ctx.Avg) {
            aggregateFnsOpts.avg = true;
        }

        return aggregateFnsOpts;
    }
}

/**
 * Tokenize the input string
 * @param input
 * @returns { error: string | null; tokens: any }
 */
export function tokenizeInput(input: string) {
    const lexerResult = lexer.tokenize(input);
    // console.log('lexerResult -->', lexerResult);
    if (lexerResult.errors.length > 0) {
        return { error: lexerResult.errors[0].message, tokens: null };
    }
    return { error: null, tokens: lexerResult.tokens };
}

/**
 *  Parse the tokens
 * @param tokens
 * @returns { error: string | null; cst: any }
 */
export function parseTokens(tokens: any) {
    parser.input = tokens;
    const cst = parser.expression();

    if (parser.errors.length > 0) {
        return { error: parser.errors[0].message, cst: null };
    }
    return { error: null, cst: cst };
}

/**
 * Visit the CST
 * @param cst
 * @returns  { error: string | null; value: number | null }
 */
export function visitCst(cst: any) {
    const visitor = new ArithmeticCstVisitor();
    const value = visitor.visit(cst);
    return { error: null, value: value };
}

/**
 * Evaluate the arithmetic expression
 * @param input
 * @returns
 */
export function evaluateArithmeticExpression(input: string) {
    const response: { error: string | null; value: number | null } = { error: null, value: null };

    const lexerResult = tokenizeInput(input);
    // console.log('lexerResult -->: ', lexerResult);
    if (lexerResult.error) {
        response.error = lexerResult.error;
        return response;
    }

    const parserResult = parseTokens(lexerResult.tokens);
    // console.log('parserResult -->: ', parserResult);
    if (parserResult.error) {
        response.error = parserResult.error;
        return response;
    }

    const visitorResult = visitCst(parserResult.cst);
    if (visitorResult.error) {
        response.error = visitorResult.error;
        return response;
    }

    // console.log('visitorResult -->: ', visitorResult);
    response.value = visitorResult.value;
    return response;
}
