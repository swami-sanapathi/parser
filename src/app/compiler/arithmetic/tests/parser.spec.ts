import { parseTokens, tokenizeInput } from '../transformer';

describe('parser tests  ', () => {
    describe('simple expression', () => {
        const input = '4 + 3 - 4';
        const tokens = tokenizeInput(input).tokens;
        const cst: any = parseTokens(tokens).cst;

        it('should have a root node named "expression"', () => {
            expect(cst.name).toBe('expression');
        });

        it('should have an "additionExpression" child', () => {
            expect(cst.children).toHaveProperty('additionExpression');
        });

        it('should have two "ArithmeticOperator" tokens', () => {
            const operators = cst.children.additionExpression[0].children.ArithmeticOperator;
            expect(operators).toHaveLength(2);
            expect(operators[0].tokenType.name).toBe('Add');
            expect(operators[1].tokenType.name).toBe('Subtract');
        });

        it('should have three "NumberLiteral" tokens', () => {
            const numberLiterals = [
                ...cst.children.additionExpression[0].children.lhs[0].children.lhs[0].children.NumberLiteral,
                ...cst.children.additionExpression[0].children.rhs[0].children.lhs[0].children.NumberLiteral,
                ...cst.children.additionExpression[0].children.rhs[1].children.lhs[0].children.NumberLiteral,
            ];
            expect(numberLiterals).toHaveLength(3);
            expect(numberLiterals.map((token) => token.image)).toEqual(['4', '3', '4']);
        });
    });

    describe('complex expression', () => {
        const input = '((2 + 3) * 4)/5';
        const tokens = tokenizeInput(input).tokens;
        const cst: any = parseTokens(tokens).cst;

        // Check root node
        expect(cst.name).toBe('expression');

        // Check first child node
        const firstChild = cst.children.additionExpression[0];
        expect(firstChild.name).toBe('additionExpression');

        // Check second child node
        const secondChild = firstChild.children.lhs[0];
        expect(secondChild.name).toBe('multiplicationExpression');

        // Check third child node
        const thirdChild = secondChild.children.lhs[0];
        expect(thirdChild.name).toBe('atomicExpression');

        const multipleOperator = secondChild.children.MultiOperator[0];
        expect(multipleOperator.image).toBe('/');

        const rhsChild = secondChild.children.rhs[0];
        expect(rhsChild.name).toBe('atomicExpression');

        const NumberLiteral = rhsChild.children.NumberLiteral[0];
        expect(NumberLiteral.image).toBe('5');


    });
});
