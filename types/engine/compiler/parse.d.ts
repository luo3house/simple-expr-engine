import { Context, Expr, Rule } from '../grammar';
import { Token } from './tokenizer';
export declare module ParseErrors {
    class UnexpectedMorphemeError extends Error {
        token: Token;
        constructor(token: Token);
    }
    class UnexpectedEOFError extends Error {
        constructor();
    }
}
export interface TokenReader {
    read(): Token | null;
    rollback(): void;
}
declare module ExprParseState {
    interface StateHolder {
        setState(state: BaseState): void;
        buildExpr(ctx: Context, reader: TokenReader): Expr;
    }
    abstract class BaseState {
        mustReadToken(reader: TokenReader): Token;
        abstract build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class Begin extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadLeftBracket extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadLeft extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadOp extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadRight extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadRightBracket extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
    class End extends BaseState {
        build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
    }
}
export declare class ExprParser implements ExprParseState.StateHolder {
    protected context: Context;
    protected reader: TokenReader;
    protected state: ExprParseState.Begin;
    expr: Expr;
    constructor(context: Context, reader: TokenReader);
    buildExpr(ctx: Context, reader: TokenReader): Expr;
    setState(state: ExprParseState.BaseState): void;
    build(): Expr;
}
declare module RuleParseState {
    interface StateHolder {
        setState(state: BaseState): void;
    }
    abstract class BaseState {
        mustReadToken(reader: TokenReader): Token;
        abstract build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void;
    }
    class Begin extends BaseState {
        build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadArrow extends BaseState {
        build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void;
    }
    class ReadResult extends BaseState {
        build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void;
    }
    class End extends BaseState {
        build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void;
    }
}
export declare class RuleParser {
    protected context: Context;
    protected reader: TokenReader;
    protected state: RuleParseState.Begin;
    rule: Rule;
    constructor(context: Context, reader: TokenReader);
    setState(state: RuleParseState.BaseState): void;
    build(): Rule;
}
export {};
