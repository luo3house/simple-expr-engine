import { NoRuleResultError } from '../errors';
import { Expr, Op, Value, ExprGrammar, Operator, Rule } from '../grammar';
import { ValueHolder, VarType } from '../variable';

module Interpretable {
  export class ExprResult {
    static result(expr: Expr): boolean {
      const { context, left, op, right } = expr;
      switch (expr.getGrammar()) {
        case ExprGrammar.Expr:
          return ExprResult.result(left as Expr);
        case ExprGrammar.ExprOpExpr:
          return OpResult.resultExprOpExpr(op, left as Expr, right as Expr);
        case ExprGrammar.ValueOpValue:
          return OpResult.resultValueValue(op, left as Value, right as Value);
        default:
          return false;
      }
    }
  }
  export class OpResult {
    static resultExprOpExpr(op: Op, left: Expr, right: Expr) {
      switch (op.op) {
        case Operator.AND:
          return ExprResult.result(left) && ExprResult.result(right);
        case Operator.OR:
          return ExprResult.result(left) || ExprResult.result(right);
        default:
          return false;
      }
    }
    static resultValueValue(op: Op, v1: Value, v2: Value) {
      switch (op.op) {
        case Operator.AND:
          return (
            v1.valueHolder.cast(VarType.BOOL).asBoolean() &&
            v2.valueHolder.cast(VarType.BOOL).asBoolean()
          );
        case Operator.OR:
          return (
            v1.valueHolder.cast(VarType.BOOL).asBoolean() ||
            v2.valueHolder.cast(VarType.BOOL).asBoolean()
          );
        case Operator.EQ:
          return v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);
        case Operator.NE:
          return !v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);
        case Operator.LT:
          return v1.valueHolder.asNumber() < v2.valueHolder.asNumber();
        case Operator.GT:
          return v1.valueHolder.asNumber() > v2.valueHolder.asNumber();
        case Operator.LTE:
          return v1.valueHolder.asNumber() <= v2.valueHolder.asNumber();
        case Operator.GTE:
          return v1.valueHolder.asNumber() >= v2.valueHolder.asNumber();
        default:
          return false;
      }
    }
  }
}

export class Interpreter {
  static interpretExpr(expr: Expr) {
    return Interpretable.ExprResult.result(expr);
  }
  static interpretRules(rules: Rule[]): Value {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (this.interpretExpr(rule.expr)) {
        return rule.result;
      }
    }
    throw new NoRuleResultError();
  }
}
