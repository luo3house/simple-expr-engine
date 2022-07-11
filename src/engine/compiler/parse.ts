// 语法分析

import { Context, Expr, Var, Op, Operator, Value } from '../grammar';
import { UnexpectedMorphemeError, UnexpectedEOFError } from '../errors';
import { Morpheme, Token } from './tokenizer';
import { ValueHolder } from '../variable';

export interface TokenReader {
  read(): Token | null;
  rollback(): void;
}

module States {
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
      throw new UnexpectedMorphemeError(expr, token);
    }
  }
  export class ReadLeft extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder) {
      const token = this.mustReadToken(reader);
      switch (token.morpheme) {
        case Morpheme.VAR:
          expr.left = new Var(ctx, token.chars);
          break;
        case Morpheme.LEFT_BRACKET:
          reader.rollback();
          expr.left = new Parser(ctx, reader).build();
          break;
        default:
          throw new UnexpectedMorphemeError(expr, token);
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
          throw new UnexpectedMorphemeError(expr, token);
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
          throw new UnexpectedMorphemeError(expr, token);
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
          throw new UnexpectedMorphemeError(expr, token);
      }
    }
  }
  export class End extends BaseState {
    build(ctx: Context, expr: Expr, reader: TokenReader, holder: StateHolder): void {}
  }
}

export class Parser implements States.StateHolder {
  protected state = new States.Begin();
  expr: Expr;

  constructor(protected context: Context, protected reader: TokenReader) {
    this.expr = new Expr(context);
  }

  buildExpr(ctx: Context, reader: TokenReader): Expr {
    return new Parser(ctx, reader).build();
  }

  setState(state: States.BaseState): void {
    this.state = state;
  }

  build() {
    let complete = false;
    while (!complete) {
      this.state.build(this.context, this.expr, this.reader, this);
      if (this.state.constructor === States.End) {
        complete = true;
        break;
      }
    }
    return this.expr;
  }
}
