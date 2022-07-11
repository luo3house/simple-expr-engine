import { VariableNotFoundError } from './errors';
import { ValueHolder, Variable, VariableStore, VarType } from './variable';

export enum Operator {
  AND = 'and',
  OR = 'or',
  EQ = '=',
  NE = '<>',
  LT = '<',
  GT = '>',
  LTE = '<=',
  GTE = '>=',
}

/*

  expr -> ( expr )
  expr -> ( expr op expr )
  expr -> ( var op value )
  expr -> ( var op var )
  op -> and | or | = | <> | < | > | <= | >=
  var -> String
  value -> BOOL | "String" | NUMBER

*/

export enum ExprGrammar {
  Expr,
  ExprOpExpr,
  VarOpValue,
  VarOpVar,
}

export type Left = Expr | Var;

export type Right = Expr | Value | Var;

export type Context = {
  variableStore: VariableStore;
};

export class Expr {
  public left!: Left;
  public op!: Op;
  public right!: Right;
  constructor(public context: Context) {}

  getGrammar(): ExprGrammar | null {
    const { left, op, right } = this;
    if (left.constructor === Expr && op === null && right.constructor === null)
      return ExprGrammar.Expr;
    if (left.constructor === Expr && op !== null && right.constructor === Expr)
      return ExprGrammar.ExprOpExpr;
    if (left.constructor === Var && op !== null && right.constructor === Value)
      return ExprGrammar.VarOpValue;
    if (left.constructor === Var && op !== null && right.constructor === Var)
      return ExprGrammar.VarOpVar;
    return null;
  }
}

export class Op {
  constructor(public context: Context, public op: Operator) {}
}

export class Var {
  constructor(public context: Context, public name: string) {}

  getVariable() {
    const v = this.context.variableStore.findByName(this.name);
    if (!v) throw new VariableNotFoundError(this.name);
    return v;
  }

  getValue() {
    return new Value(this.context, this.getVariable().holder);
  }
}

export class Value {
  constructor(public context: Context, public valueHolder: ValueHolder) {}
}
