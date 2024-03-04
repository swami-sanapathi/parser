import { tokenMatcher } from "chevrotain";
import { parserInstance as parser } from "./parser";
import { Add, Multiply, lexer } from "./lexer";

const CstVisitor = parser.getBaseCstVisitorConstructor();

export default class ArithmeticCstVisitor extends CstVisitor {
    constructor() {

        super()
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
        return result
    }

    atomicExpression(ctx: any) {
        if (ctx.NumberLiteral) {
            return parseInt(ctx.NumberLiteral[0].image, 10);
        } else if (ctx.parenthesisExpression) {

        } {
            return this.visit(ctx.parenthesisExpression);
        }
    }

    parenthesisExpression(ctx: any) {
        return this.visit(ctx.expression);
    }

}

export function evaluateArithmeticExpression(input: string) {
    const response: { error: string | null, value: number | null } = { error: null, value: null }

    const lexerResult = lexer.tokenize(input);
    if (lexerResult.errors.length > 0) {
        response.error = lexerResult.errors[0].message;
        return response;
    }

    parser.input = lexerResult.tokens;
    const cst = parser.expression();
    if (parser.errors.length > 0) {
        response.error = parser.errors[0].message;

    }
    const visitor = new ArithmeticCstVisitor();
    response.value = visitor.visit(cst);
    return response;
}