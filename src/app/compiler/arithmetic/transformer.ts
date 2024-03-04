import { tokenMatcher } from 'chevrotain';
import { Add, Multiply, lexer } from './lexer';
import { parserInstance as parser } from './parser';

const CstVisitor = parser.getBaseCstVisitorConstructor();

export default class ArithmeticCstVisitor extends CstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    expression(ctx: any) {
        return this.visit(ctx.additionExpression);
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
}

export function tokenizeInput(input: string) {
    const lexerResult = lexer.tokenize(input);
    if (lexerResult.errors.length > 0) {
        return { error: lexerResult.errors[0].message, tokens: null };
    }
    return { error: null, tokens: lexerResult.tokens };
}

export function parseTokens(tokens: any) {
    parser.input = tokens;
    const cst = parser.expression();

    console.log(cst);
    if (parser.errors.length > 0) {
        return { error: parser.errors[0].message, cst: null };
    }
    return { error: null, cst: cst };
}

export function visitCst(cst: any) {
    const visitor = new ArithmeticCstVisitor();
    const value = visitor.visit(cst);
    return { error: null, value: value };
}

export function evaluateArithmeticExpression(input: string) {
    const response: { error: string | null; value: number | null } = { error: null, value: null };

    const lexerResult = tokenizeInput(input);
    if (lexerResult.error) {
        response.error = lexerResult.error;
        return response;
    }

    const parserResult = parseTokens(lexerResult.tokens);
    if (parserResult.error) {
        response.error = parserResult.error;
        return response;
    }

    const visitorResult = visitCst(parserResult.cst);
    if (visitorResult.error) {
        response.error = visitorResult.error;
        return response;
    }

    response.value = visitorResult.value;
    return response;
}
