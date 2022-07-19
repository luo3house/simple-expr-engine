"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Var = exports.Value = exports.Op = exports.Expr = exports.Rule = exports.ExprGrammar = exports.Operator = void 0;
var Operator;
(function (Operator) {
    Operator["AND"] = "and";
    Operator["OR"] = "or";
    Operator["EQ"] = "==";
    Operator["NE"] = "!=";
    Operator["LT"] = "<";
    Operator["GT"] = ">";
    Operator["LTE"] = "<=";
    Operator["GTE"] = ">=";
})(Operator = exports.Operator || (exports.Operator = {}));
/*

  rule -> ( expr ) => value
  expr -> ( expr )
  expr -> ( expr op expr )
  expr -> ( value op value )
  op -> and | or | == | != | < | > | <= | >=
  value -> BOOL | "String" | NUMBER | var
  var -> String

*/
var ExprGrammar;
(function (ExprGrammar) {
    ExprGrammar[ExprGrammar["Expr"] = 0] = "Expr";
    ExprGrammar[ExprGrammar["ExprOpExpr"] = 1] = "ExprOpExpr";
    ExprGrammar[ExprGrammar["ValueOpValue"] = 2] = "ValueOpValue";
})(ExprGrammar = exports.ExprGrammar || (exports.ExprGrammar = {}));
class Rule {
    constructor(context) {
        this.context = context;
    }
}
exports.Rule = Rule;
class Expr {
    constructor(context) {
        this.context = context;
    }
    getGrammar() {
        const { left, op, right } = this;
        if (left instanceof Expr && op === null && right === null)
            return ExprGrammar.Expr;
        if (left instanceof Expr && op !== null && right instanceof Expr)
            return ExprGrammar.ExprOpExpr;
        if (left instanceof Value && op !== null && right instanceof Value)
            return ExprGrammar.ValueOpValue;
        return null;
    }
}
exports.Expr = Expr;
class Op {
    constructor(context, op) {
        this.context = context;
        this.op = op;
    }
}
exports.Op = Op;
class Value {
    constructor(context, valueHolder) {
        this.context = context;
        this.valueHolder = valueHolder;
    }
}
exports.Value = Value;
class Var extends Value {
    constructor(context, name) {
        super(context, context.variableStore.findByName(name).holder);
        this.context = context;
        this.name = name;
    }
}
exports.Var = Var;
