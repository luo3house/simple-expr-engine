"use strict";
// 语法分析
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleParser = exports.ExprParser = exports.ParseErrors = void 0;
const grammar_1 = require("../grammar");
const tokenizer_1 = require("./tokenizer");
const variable_1 = require("../variable");
var ParseErrors;
(function (ParseErrors) {
    class UnexpectedMorphemeError extends Error {
        constructor(token) {
            super(`unexpected morpheme ${token.toString()}`);
            this.token = token;
        }
    }
    ParseErrors.UnexpectedMorphemeError = UnexpectedMorphemeError;
    class UnexpectedEOFError extends Error {
        constructor() {
            super(`unexpected EOF`);
        }
    }
    ParseErrors.UnexpectedEOFError = UnexpectedEOFError;
})(ParseErrors = exports.ParseErrors || (exports.ParseErrors = {}));
var ExprParseState;
(function (ExprParseState) {
    class BaseState {
        mustReadToken(reader) {
            const token = reader.read();
            if (!token)
                throw new ParseErrors.UnexpectedEOFError();
            return token;
        }
    }
    ExprParseState.BaseState = BaseState;
    class Begin extends BaseState {
        build(ctx, expr, reader, holder) {
            holder.setState(new ReadLeftBracket());
        }
    }
    ExprParseState.Begin = Begin;
    class ReadLeftBracket extends BaseState {
        build(ctx, expr, reader, holder) {
            const token = this.mustReadToken(reader);
            if (token.morpheme === tokenizer_1.Morpheme.LEFT_BRACKET) {
                holder.setState(new ReadLeft());
                return;
            }
            throw new ParseErrors.UnexpectedMorphemeError(token);
        }
    }
    ExprParseState.ReadLeftBracket = ReadLeftBracket;
    class ReadLeft extends BaseState {
        build(ctx, expr, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.LEFT_BRACKET:
                    reader.rollback();
                    expr.left = new ExprParser(ctx, reader).build();
                    break;
                case tokenizer_1.Morpheme.VAR:
                    expr.left = new grammar_1.Var(ctx, token.chars);
                    break;
                case tokenizer_1.Morpheme.BOOL:
                    expr.left = new grammar_1.Value(expr.context, variable_1.ValueHolder.newBOOL(token.chars === 'true'));
                    break;
                case tokenizer_1.Morpheme.NUMBER:
                    expr.left = new grammar_1.Value(expr.context, variable_1.ValueHolder.newNUMBER(parseFloat(token.chars)));
                    break;
                case tokenizer_1.Morpheme.STRING:
                    expr.left = new grammar_1.Value(expr.context, variable_1.ValueHolder.newSTRING(token.unescapeSTRING()));
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
            holder.setState(new ReadOp());
        }
    }
    ExprParseState.ReadLeft = ReadLeft;
    class ReadOp extends BaseState {
        build(ctx, expr, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.RIGHT_BRACKET:
                    holder.setState(new End());
                    break;
                case tokenizer_1.Morpheme.OPERATOR:
                    expr.op = new grammar_1.Op(expr.context, token.chars);
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
            holder.setState(new ReadRight());
        }
    }
    ExprParseState.ReadOp = ReadOp;
    class ReadRight extends BaseState {
        build(ctx, expr, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.LEFT_BRACKET:
                    reader.rollback();
                    expr.right = holder.buildExpr(expr.context, reader);
                    break;
                case tokenizer_1.Morpheme.VAR:
                    expr.right = new grammar_1.Var(ctx, token.chars);
                    break;
                case tokenizer_1.Morpheme.BOOL:
                    expr.right = new grammar_1.Value(expr.context, variable_1.ValueHolder.newBOOL(token.chars === 'true'));
                    break;
                case tokenizer_1.Morpheme.NUMBER:
                    expr.right = new grammar_1.Value(expr.context, variable_1.ValueHolder.newNUMBER(parseFloat(token.chars)));
                    break;
                case tokenizer_1.Morpheme.STRING:
                    expr.right = new grammar_1.Value(expr.context, variable_1.ValueHolder.newSTRING(token.unescapeSTRING()));
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
            holder.setState(new ReadRightBracket());
        }
    }
    ExprParseState.ReadRight = ReadRight;
    class ReadRightBracket extends BaseState {
        build(ctx, expr, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.RIGHT_BRACKET:
                    holder.setState(new End());
                    break;
                case tokenizer_1.Morpheme.OPERATOR: // a op b op c -> ( a op b ) op c
                    const newExpr = new grammar_1.Expr(ctx);
                    newExpr.left = expr.left;
                    newExpr.op = expr.op;
                    newExpr.right = expr.right;
                    expr.left = newExpr;
                    expr.right = null;
                    reader.rollback();
                    holder.setState(new ReadOp());
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
        }
    }
    ExprParseState.ReadRightBracket = ReadRightBracket;
    class End extends BaseState {
        build(ctx, expr, reader, holder) { }
    }
    ExprParseState.End = End;
})(ExprParseState || (ExprParseState = {}));
class ExprParser {
    constructor(context, reader) {
        this.context = context;
        this.reader = reader;
        this.state = new ExprParseState.Begin();
        this.expr = new grammar_1.Expr(context);
    }
    buildExpr(ctx, reader) {
        return new ExprParser(ctx, reader).build();
    }
    setState(state) {
        this.state = state;
    }
    build() {
        let complete = false;
        while (!complete) {
            this.state.build(this.context, this.expr, this.reader, this);
            if (this.state.constructor === ExprParseState.End) {
                complete = true;
                break;
            }
        }
        return this.expr;
    }
}
exports.ExprParser = ExprParser;
var RuleParseState;
(function (RuleParseState) {
    class BaseState {
        mustReadToken(reader) {
            const token = reader.read();
            if (!token)
                throw new ParseErrors.UnexpectedEOFError();
            return token;
        }
    }
    RuleParseState.BaseState = BaseState;
    class Begin extends BaseState {
        build(ctx, rule, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.LEFT_BRACKET:
                    reader.rollback();
                    rule.expr = new ExprParser(ctx, reader).build();
                    holder.setState(new ReadArrow());
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
        }
    }
    RuleParseState.Begin = Begin;
    class ReadArrow extends BaseState {
        build(ctx, rule, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.RESULT_POINTING:
                    holder.setState(new ReadResult());
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
        }
    }
    RuleParseState.ReadArrow = ReadArrow;
    class ReadResult extends BaseState {
        build(ctx, rule, reader, holder) {
            const token = this.mustReadToken(reader);
            switch (token.morpheme) {
                case tokenizer_1.Morpheme.VAR:
                    rule.result = new grammar_1.Var(ctx, token.chars);
                    break;
                case tokenizer_1.Morpheme.BOOL:
                    rule.result = new grammar_1.Value(ctx, variable_1.ValueHolder.newBOOL(token.chars === 'true'));
                    break;
                case tokenizer_1.Morpheme.NUMBER:
                    rule.result = new grammar_1.Value(ctx, variable_1.ValueHolder.newNUMBER(parseFloat(token.chars)));
                    break;
                case tokenizer_1.Morpheme.STRING:
                    rule.result = new grammar_1.Value(ctx, variable_1.ValueHolder.newSTRING(token.unescapeSTRING()));
                    break;
                default:
                    throw new ParseErrors.UnexpectedMorphemeError(token);
            }
            holder.setState(new End());
        }
    }
    RuleParseState.ReadResult = ReadResult;
    class End extends BaseState {
        build(ctx, rule, reader, holder) { }
    }
    RuleParseState.End = End;
})(RuleParseState || (RuleParseState = {}));
class RuleParser {
    constructor(context, reader) {
        this.context = context;
        this.reader = reader;
        this.state = new RuleParseState.Begin();
        this.rule = new grammar_1.Rule(context);
    }
    setState(state) {
        this.state = state;
    }
    build() {
        let complete = false;
        while (!complete) {
            this.state.build(this.context, this.rule, this.reader, this);
            if (this.state.constructor === RuleParseState.End) {
                complete = true;
                break;
            }
        }
        return this.rule;
    }
}
exports.RuleParser = RuleParser;
