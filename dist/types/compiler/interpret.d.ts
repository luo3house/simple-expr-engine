import { Expr, Value, Rule } from '../core/grammar';
export declare module InterpretErrors {
    class NoRuleResultError extends Error {
        constructor();
    }
}
export declare class Interpreter {
    static interpretExpr(expr: Expr): boolean;
    static interpretRules(rules: Rule[]): Value;
}
