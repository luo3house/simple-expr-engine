"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semantic = exports.SemanticErrors = void 0;
const grammar_1 = require("../grammar");
var SemanticErrors;
(function (SemanticErrors) {
    class OpNotMatchError extends Error {
        constructor(op, left, right) {
            super(`op is not match at ( left op right ): (${left} ${op} ${right})`);
            this.op = op;
            this.left = left;
            this.right = right;
        }
    }
    SemanticErrors.OpNotMatchError = OpNotMatchError;
    class VariableNotFoundError extends Error {
        constructor(name) {
            super(`variable ${name} not found`);
        }
    }
    SemanticErrors.VariableNotFoundError = VariableNotFoundError;
})(SemanticErrors = exports.SemanticErrors || (exports.SemanticErrors = {}));
class Semantic {
    matchExpr(expr) {
        const { left, op, right } = expr;
        if (((left === null || left === void 0 ? void 0 : left.constructor) === grammar_1.Expr && (right === null || right === void 0 ? void 0 : right.constructor) === grammar_1.Expr) ||
            ((left === null || left === void 0 ? void 0 : left.constructor) === grammar_1.Var && (right === null || right === void 0 ? void 0 : right.constructor) === grammar_1.Value) ||
            ((left === null || left === void 0 ? void 0 : left.constructor) === grammar_1.Var && (right === null || right === void 0 ? void 0 : right.constructor) === grammar_1.Var)) {
            this.matchOp(op, left, right);
            if ((left === null || left === void 0 ? void 0 : left.constructor) === grammar_1.Var) {
                this.matchVar(left);
            }
            if ((right === null || right === void 0 ? void 0 : right.constructor) === grammar_1.Var) {
                this.matchVar(right);
            }
        }
        else if ((left === null || left === void 0 ? void 0 : left.constructor) === grammar_1.Expr && op === null && right === null) {
            this.matchExpr(left);
        }
        else {
            return false;
        }
    }
    matchOp(op, left, right) {
        if (left.constructor === grammar_1.Expr && right.constructor === grammar_1.Expr) {
            if (!([grammar_1.Operator.AND, grammar_1.Operator.OR].indexOf(op.op) !== -1)) {
                throw new SemanticErrors.OpNotMatchError(op, left, right);
            }
        }
        else if ((left.constructor === grammar_1.Var && right.constructor === grammar_1.Value) ||
            (left.constructor === grammar_1.Var && right.constructor === grammar_1.Var)) {
            if (!([grammar_1.Operator.EQ, grammar_1.Operator.NE, grammar_1.Operator.LT, grammar_1.Operator.GT, grammar_1.Operator.LTE, grammar_1.Operator.GTE].indexOf(op.op) !== -1)) {
                throw new SemanticErrors.OpNotMatchError(op, left, right);
            }
        }
    }
    matchVar(v) {
        if (!v.context.variableStore.findByName(v.name)) {
            throw new SemanticErrors.VariableNotFoundError(v.name);
        }
    }
}
exports.Semantic = Semantic;
