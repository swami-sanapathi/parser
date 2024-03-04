import { Lexer, createToken } from "chevrotain";

export const ArithmeticOperator = createToken({
    name: "ArithmeticOperator",
    pattern: Lexer.NA
})

export const MultiOperator = createToken({
    name: "MultiOperator",
    pattern: Lexer.NA
})

export const Add = createToken({
    name: "Add",
    pattern: /\+/,
    categories: ArithmeticOperator,
})

export const Subtract = createToken({
    name: "Subtract",
    pattern: /-/,
    categories: ArithmeticOperator,
})

export const Multiply = createToken({
    name: "Multiply",
    pattern: /\*/,
    categories: MultiOperator,
})

export const Divide = createToken({
    name: "Divide",
    pattern: /\//,
    categories: MultiOperator,
})

export const LParen = createToken({
    name: "LParen",
    pattern: /\(/,
})

export const RParen = createToken({
    name: "RParen",
    pattern: /\)/,
})

export const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /[1-9]\d*/
})

export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
})


export const allTokens = [
    WhiteSpace,
    ArithmeticOperator,
    MultiOperator,
    Add,
    Subtract,
    Multiply,
    Divide,
    LParen,
    RParen,
    NumberLiteral
]

export const lexer = new Lexer(allTokens);