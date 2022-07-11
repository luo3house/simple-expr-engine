import { Expr, Left, Op, Right, Value, Var } from './grammar';
import { Token } from './compiler/tokenizer';
import { VarType } from './variable';

export class TokenNotRecognizeError extends Error {
  constructor(chars: string) {
    super(`unrecognized token: ${chars}`);
  }
}

export class ExprError extends Error {
  constructor(public expr: Expr, public message: string) {
    super(message);
  }
}

export class UnexpectedMorphemeError extends ExprError {
  constructor(public expr: Expr, public token: Token) {
    super(expr, `unexpected morpheme ${token.toString()} while building expr: ${expr.toString()}`);
  }
}

export class VariableNotFoundError extends Error {
  constructor(name: string) {
    super(`variable ${name} not found`);
  }
}

export class UnexpectedEOFError extends Error {
  constructor() {
    super(`unexpected EOF`);
  }
}

export class ExprNotMatchError extends ExprError {
  constructor(public expr: Expr) {
    super(expr, `expr is not match at: ${expr.toString()}`);
  }
}

export class OpNotMatchError extends Error {
  constructor(public op: Op, public left: Left, public right: Right) {
    super(`op is not match at ( left op right ): (${left} ${op} ${right})`);
  }
}

export class TypeNotMatchError extends Error {
  constructor(public expected: VarType, public got: VarType) {
    super(`type is not match: expected ${expected} but got: ${got}`);
  }
}

export class WithCharsReadedError extends Error {
  constructor(public charsReaded: string, public nestedError: Error) {
    super(nestedError?.message ?? '');
  }
}
