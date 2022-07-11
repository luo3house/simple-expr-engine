import { Expr, Op, Var, Value, ExprGrammar, Operator } from '../grammar';
import { VarType } from '../variable';

module Interpretable {
  export class ExprResult {
    static result(expr: Expr): boolean {
      const { context, left, op, right } = expr;
      switch (expr.getGrammar()) {
        case ExprGrammar.Expr:
          return ExprResult.result(left as Expr);
        case ExprGrammar.ExprOpExpr:
          return OpResult.resultExprOpExpr(op, left as Expr, right as Expr);
        case ExprGrammar.VarOpValue:
          return OpResult.resultVarValue(op, left as Var, right as Value);
        case ExprGrammar.VarOpVar:
          return OpResult.resultVarVar(op, left as Var, right as Var);
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
    static resultVarVar(op: Op, v1: Var, v2: Var) {
      return this.resultVarValue(op, v1, v2.getValue());
    }
    static resultVarValue(op: Op, v: Var, val: Value) {
      switch (op.op) {
        case Operator.AND:
          return (
            v.getValue().valueHolder.cast(VarType.BOOL).asBoolean() &&
            val.valueHolder.cast(VarType.BOOL).asBoolean()
          );
        case Operator.OR:
          return (
            v.getValue().valueHolder.cast(VarType.BOOL).asBoolean() ||
            val.valueHolder.cast(VarType.BOOL).asBoolean()
          );
        case Operator.EQ:
          return v.getValue().valueHolder.equalsValueWithTypeCast(val.valueHolder);
        case Operator.NE:
          return !v.getValue().valueHolder.equalsValueWithTypeCast(val.valueHolder);
        case Operator.LT:
          return v.getValue().valueHolder.asNumber() < val.valueHolder.asNumber();
        case Operator.GT:
          return v.getValue().valueHolder.asNumber() > val.valueHolder.asNumber();
        case Operator.LTE:
          return v.getValue().valueHolder.asNumber() <= val.valueHolder.asNumber();
        case Operator.GTE:
          return v.getValue().valueHolder.asNumber() >= val.valueHolder.asNumber();
        default:
          return false;
      }
    }
  }
}

export class Interpreter {
  static interpret(expr: Expr) {
    return Interpretable.ExprResult.result(expr);
  }
}
