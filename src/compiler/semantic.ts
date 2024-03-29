import { Expr, Op, Var, Value, Left, Right, Operator } from '../core/grammar';

export module SemanticErrors {
  export class OpNotMatchError extends Error {
    constructor(public op: Op, public left: Left, public right: Right) {
      super(`op is not match at ( left op right ): (${left} ${op} ${right})`);
    }
  }
  export class VariableNotFoundError extends Error {
    constructor(name: string) {
      super(`variable ${name} not found`);
    }
  }
}

export class Semantic {
  matchExpr(expr: Expr) {
    const { left, op, right } = expr;
    if (
      (left?.constructor === Expr && right?.constructor === Expr) ||
      (left?.constructor === Var && right?.constructor === Value) ||
      (left?.constructor === Var && right?.constructor === Var)
    ) {
      this.matchOp(op, left, right);
      if (left?.constructor === Var) {
        this.matchVar(left as Var);
      }
      if (right?.constructor === Var) {
        this.matchVar(right as Var);
      }
    } else if (left?.constructor === Expr && op === null && right === null) {
      this.matchExpr(left as Expr);
    } else {
      return false;
    }
  }

  matchOp(op: Op, left: Left, right: Right) {
    if (left.constructor === Expr && right.constructor === Expr) {
      if (!([Operator.AND, Operator.OR].indexOf(op.op) !== -1)) {
        throw new SemanticErrors.OpNotMatchError(op, left, right);
      }
    } else if (
      (left.constructor === Var && right.constructor === Value) ||
      (left.constructor === Var && right.constructor === Var)
    ) {
      if (
        !(
          [Operator.EQ, Operator.NE, Operator.LT, Operator.GT, Operator.LTE, Operator.GTE].indexOf(
            op.op,
          ) !== -1
        )
      ) {
        throw new SemanticErrors.OpNotMatchError(op, left, right);
      }
    }
  }

  matchVar(v: Var) {
    if (!v.context.variableStore.findByName(v.name)) {
      throw new SemanticErrors.VariableNotFoundError(v.name);
    }
  }
}
