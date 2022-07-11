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
  expr -> ( value op value )
  op -> and | or | = | <> | < | > | <= | >=
  value -> BOOL | "String" | NUMBER | var
  var -> String

*/

export enum ExprGrammar {
  Expr,
  ExprOpExpr,
  ValueOpValue,
}

export type Left = Expr | Value;

export type Right = Expr | Value;

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
    if (left instanceof Expr && op === null && right === null) return ExprGrammar.Expr;
    if (left instanceof Expr && op !== null && right instanceof Expr) return ExprGrammar.ExprOpExpr;
    if (left instanceof Value && op !== null && right instanceof Value)
      return ExprGrammar.ValueOpValue;
    return null;
  }
}

export class Op {
  constructor(public context: Context, public op: Operator) {}
}

export class Value {
  constructor(public context: Context, public valueHolder: ValueHolder) {}

  getValue() {
    return new Value(this.context, this.valueHolder);
  }
}

export class Var extends Value {
  constructor(public context: Context, public name: string) {
    super(context, context.variableStore.findByName(name).holder);
  }
}
