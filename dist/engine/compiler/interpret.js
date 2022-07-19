"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.InterpretErrors = void 0;
const grammar_1 = require("../grammar");
const variable_1 = require("../variable");
var InterpretErrors;
(function (InterpretErrors) {
    class NoRuleResultError extends Error {
        constructor() {
            super(`no rule result is return out`);
        }
    }
    InterpretErrors.NoRuleResultError = NoRuleResultError;
})(InterpretErrors = exports.InterpretErrors || (exports.InterpretErrors = {}));
var Interpretable;
(function (Interpretable) {
    class ExprResult {
        static result(expr) {
            const { context, left, op, right } = expr;
            switch (expr.getGrammar()) {
                case grammar_1.ExprGrammar.Expr:
                    return ExprResult.result(left);
                case grammar_1.ExprGrammar.ExprOpExpr:
                    return OpResult.resultExprOpExpr(op, left, right);
                case grammar_1.ExprGrammar.ValueOpValue:
                    return OpResult.resultValueValue(op, left, right);
                default:
                    return false;
            }
        }
    }
    Interpretable.ExprResult = ExprResult;
    class OpResult {
        static resultExprOpExpr(op, left, right) {
            switch (op.op) {
                case grammar_1.Operator.AND:
                    return ExprResult.result(left) && ExprResult.result(right);
                case grammar_1.Operator.OR:
                    return ExprResult.result(left) || ExprResult.result(right);
                default:
                    return false;
            }
        }
        static resultValueValue(op, v1, v2) {
            switch (op.op) {
                case grammar_1.Operator.AND:
                    return (v1.valueHolder.cast(variable_1.VarType.BOOL).asBoolean() &&
                        v2.valueHolder.cast(variable_1.VarType.BOOL).asBoolean());
                case grammar_1.Operator.OR:
                    return (v1.valueHolder.cast(variable_1.VarType.BOOL).asBoolean() ||
                        v2.valueHolder.cast(variable_1.VarType.BOOL).asBoolean());
                case grammar_1.Operator.EQ:
                    return v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);
                case grammar_1.Operator.NE:
                    return !v1.valueHolder.equalsValueWithTypeCast(v2.valueHolder);
                case grammar_1.Operator.LT:
                    return v1.valueHolder.asNumber() < v2.valueHolder.asNumber();
                case grammar_1.Operator.GT:
                    return v1.valueHolder.asNumber() > v2.valueHolder.asNumber();
                case grammar_1.Operator.LTE:
                    return v1.valueHolder.asNumber() <= v2.valueHolder.asNumber();
                case grammar_1.Operator.GTE:
                    return v1.valueHolder.asNumber() >= v2.valueHolder.asNumber();
                default:
                    return false;
            }
        }
    }
    Interpretable.OpResult = OpResult;
})(Interpretable || (Interpretable = {}));
class Interpreter {
    static interpretExpr(expr) {
        return Interpretable.ExprResult.result(expr);
    }
    static interpretRules(rules) {
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (this.interpretExpr(rule.expr)) {
                return rule.result;
            }
        }
        throw new InterpretErrors.NoRuleResultError();
    }
}
exports.Interpreter = Interpreter;
