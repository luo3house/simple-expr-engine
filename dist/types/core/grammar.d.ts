import { ValueHolder, VariableStore } from './variable';
export declare enum Operator {
    AND = "and",
    OR = "or",
    EQ = "==",
    NE = "!=",
    LT = "<",
    GT = ">",
    LTE = "<=",
    GTE = ">="
}
export declare enum ExprGrammar {
    Expr = 0,
    ExprOpExpr = 1,
    ValueOpValue = 2
}
export declare type Left = Expr | Value;
export declare type Right = Expr | Value;
export declare type Context = {
    variableStore: VariableStore;
};
export declare class Rule {
    context: Context;
    expr: Expr;
    result: Value;
    constructor(context: Context);
}
export declare class Expr {
    context: Context;
    left: Left;
    op: Op;
    right: Right;
    constructor(context: Context);
    getGrammar(): ExprGrammar | null;
}
export declare class Op {
    context: Context;
    op: Operator;
    constructor(context: Context, op: Operator);
}
export declare class Value {
    context: Context;
    valueHolder: ValueHolder;
    constructor(context: Context, valueHolder: ValueHolder);
}
export declare class Var extends Value {
    context: Context;
    name: string;
    constructor(context: Context, name: string);
}
