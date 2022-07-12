// 语法分析

import { Context, Expr, Var, Op, Operator, Value, Rule } from '../grammar';
import { UnexpectedMorphemeError, UnexpectedEOFError } from '../errors';
import { Morpheme, Token } from './tokenizer';
import { ValueHolder } from '../variable';

export interface TokenReader {
  read(): Token | null;
  rollback(): void;
}

module ExprParseState {
  export interface StateHolder {
    setState(state: BaseState): void;
    buildExpr(ctx: Context, reader: TokenReader): Expr;
  }
  export abstract class BaseState {
    mustReadToken(reader: TokenReader) {
      const token = reader.read();
      if (!token) throw new UnexpectedEOFError();
      return token;
    }
    abstract build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void;
  }

  export class Begin extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void {
      holder.setState(new ReadLeftBracket());
    }
  }
  export class ReadLeftBracket extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder) {
      const token = this.mustReadToken(reader);
      if (token.morpheme === Morpheme.LEFT_BRACKET) {
        holder.setState(new ReadLeft());
        return;
      }
      throw new UnexpectedMorphemeError(token);
    }
  }
  export class ReadLeft extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder) {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.LEFT_BRACKET:
          reader.rollback();
          expr.left = new ExprParser(ctx, reader).build();
          break;
        case Morpheme.VAR:
          expr.left = new Var(ctx, token.chars);
          break;
        case Morpheme.BOOL:
          expr.left = new Value(expr.context, ValueHolder.newBOOL(token.chars === 'true'));
          break;
        case Morpheme.NUMBER:
          expr.left = new Value(expr.context, ValueHolder.newNUMBER(parseFloat(token.chars)));
          break;
        case Morpheme.STRING:
          expr.left = new Value(expr.context, ValueHolder.newSTRING(token.unescapeSTRING()));
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
      holder.setState(new ReadOp());
    }
  }
  export class ReadOp extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder) {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.RIGHT_BRACKET:
          holder.setState(new End());
          break;
        case Morpheme.OPERATOR:
          expr.op = new Op(expr.context, token.chars as Operator);
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
      holder.setState(new ReadRight());
    }
  }
  export class ReadRight extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder) {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.LEFT_BRACKET:
          reader.rollback();
          expr.right = holder.buildExpr(expr.context, reader);
          break;
        case Morpheme.VAR:
          expr.right = new Var(ctx, token.chars);
          break;
        case Morpheme.BOOL:
          expr.right = new Value(expr.context, ValueHolder.newBOOL(token.chars === 'true'));
          break;
        case Morpheme.NUMBER:
          expr.right = new Value(expr.context, ValueHolder.newNUMBER(parseFloat(token.chars)));
          break;
        case Morpheme.STRING:
          expr.right = new Value(expr.context, ValueHolder.newSTRING(token.unescapeSTRING()));
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
      holder.setState(new ReadRightBracket());
    }
  }
  export class ReadRightBracket extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.RIGHT_BRACKET:
          holder.setState(new End());
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
    }
  }
  export class End extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void {}
  }
}

export class ExprParser implements ExprParseState.StateHolder {
  protected state = new ExprParseState.Begin();
  expr: Expr;

  constructor(protected context: Context, protected reader: TokenReader) {
    this.expr = new Expr(context);
  }

  buildExpr(ctx: Context, reader: TokenReader): Expr {
    return new ExprParser(ctx, reader).build();
  }

  setState(state: ExprParseState.BaseState): void {
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

module RuleParseState {
  export interface StateHolder {
    setState(state: BaseState): void;
  }
  export abstract class BaseState {
    mustReadToken(reader: TokenReader) {
      const token = reader.read();
      if (!token) throw new UnexpectedEOFError();
      return token;
    }
    abstract build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void;
  }
  export class Begin extends BaseState {
    build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.LEFT_BRACKET:
          reader.rollback();
          rule.expr = new ExprParser(ctx, reader).build();
          holder.setState(new ReadArrow());
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
    }
  }
  export class ReadArrow extends BaseState {
    build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.RESULT_POINTING:
          holder.setState(new ReadResult());
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
    }
  }
  export class ReadResult extends BaseState {
    build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.VAR:
          rule.result = new Var(ctx, token.chars);
          break;
        case Morpheme.BOOL:
          rule.result = new Value(ctx, ValueHolder.newBOOL(token.chars === 'true'));
          break;
        case Morpheme.NUMBER:
          rule.result = new Value(ctx, ValueHolder.newNUMBER(parseFloat(token.chars)));
          break;
        case Morpheme.STRING:
          rule.result = new Value(ctx, ValueHolder.newSTRING(token.unescapeSTRING()));
          break;
        default:
          throw new UnexpectedMorphemeError(token);
      }
      holder.setState(new End());
    }
  }
  export class End extends BaseState {
    build(ctx: Context, rule: Rule, reader: TokenReader, holder: StateHolder): void {}
  }
}

export class RuleParser {
  protected state = new RuleParseState.Begin();
  rule: Rule;

  constructor(protected context: Context, protected reader: TokenReader) {
    this.rule = new Rule(context);
  }

  setState(state: RuleParseState.BaseState): void {
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
