import { Expr, Op, Var, Left, Right } from '../core/grammar';
export declare module SemanticErrors {
    class OpNotMatchError extends Error {
        op: Op;
        left: Left;
        right: Right;
        constructor(op: Op, left: Left, right: Right);
    }
    class VariableNotFoundError extends Error {
        constructor(name: string);
    }
}
export declare class Semantic {
    matchExpr(expr: Expr): false | undefined;
    matchOp(op: Op, left: Left, right: Right): void;
    matchVar(v: Var): void;
}
