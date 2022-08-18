import { Context, Expr, Rule } from '../core/grammar';
export declare class Facade {
    static buildRules(context: Context, ruleSources: string[]): Rule[];
    static buildExpr(context: Context, exprSource: string): Expr;
}
