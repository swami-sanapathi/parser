import { tokenMatcher } from 'chevrotain';
import { arithmeticParser } from './parser';
import { Add, Multi } from './tokens';
import { lexerTokens } from './lexer';

const CstVisitor = arithmeticParser.getBaseCstVisitorConstructor();

export default class Transformer extends CstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    expression(ctx) {
        return this.visit(ctx.mul);
    }

    mul(ctx) {
        let result = this.visit(ctx.lhs);
        if (ctx.rhs?.length) {
            ctx.rhs.forEach((rhs, index) => {
                const operator = ctx.MultiplyOperator[index];
                if (tokenMatcher(operator, Multi)) result *= this.visit(rhs);
                else result /= this.visit(rhs);
            });
        }

        return result;
    }

    add(ctx) {
        let result = this.visit(ctx.atomic);

        if (ctx.rhs?.length) {
            ctx.rhs.forEach((rhs, index) => {
                const operator = ctx.AdditionOperator[index];
                if (tokenMatcher(operator, Add)) result += this.visit(rhs);
                else result -= this.visit(rhs);
            });
        }
        return result;
    }

    atomic(ctx) {
        if (ctx.parens) return this.visit(ctx.parens);
        if (ctx.NumberLiteral) return parseInt(ctx.NumberLiteral[0].image, 10);
    }

    parens(ctx) {
        return this.visit(ctx.expression);
    }
}

// This function is used to validate the input expression
/**
 *
 * @param {*} input
 * @returns {error: string, value: number   }
 */
export function validateExpression(input) {
    try {
        const returnVal = { error: null, value: 0 };
        const lexerResult = lexerTokens(input);

        if (lexerResult.errors.length > 0) {
            returnVal.error = lexerResult.errors[0].message;
        }

        arithmeticParser.input = lexerResult.tokens;
        const cst = arithmeticParser.expression();

        if (!returnVal.error && arithmeticParser.errors.length > 0) {
            returnVal.error = arithmeticParser.errors[0].message;
        }

        const visitor = new Transformer();
        returnVal.value = visitor.visit(cst);

        return returnVal;
    } catch (error) {
        return error;
    }
}
