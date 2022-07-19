// 词法分析

import { Operator } from '../grammar';
import { TokenReader } from './parse';

export module TokenizerErrors {
  export class TokenNotRecognizeError extends Error {
    constructor(chars: string) {
      super(`unrecognized token: ${chars}`);
    }
  }
}

export enum Morpheme {
  LEFT_BRACKET,
  RIGHT_BRACKET,
  VAR,
  OPERATOR,
  RESULT_POINTING,
  BOOL,
  NUMBER,
  STRING,
}
const { LEFT_BRACKET, RIGHT_BRACKET, VAR, RESULT_POINTING, BOOL, NUMBER, STRING, OPERATOR } =
  Morpheme;

type TokenRecognizers = (chars: string) => Token | false;

export class Token {
  public static newReader(tokens: Token[]): TokenReader {
    return new (class implements TokenReader {
      charsReaded: string[] = [];
      offset = 0;
      read(): Token | null {
        const token = tokens[this.offset] ?? null;
        if (token) {
          this.offset++;
          this.charsReaded.push(token.chars);
        }
        return token;
      }
      rollback(): void {
        this.charsReaded.pop();
        this.offset--;
      }
      getCharsReaded = () => this.charsReaded.join(' ');
    })();
  }

  public static recognize(tkn: string): Token {
    for (let i = 0; i < this.TokenRecognizers.length; i++) {
      const token = this.TokenRecognizers[i](tkn);
      if (token !== false) {
        return token;
      }
    }
    throw new TokenizerErrors.TokenNotRecognizeError(tkn);
  }

  public static recognizeAll(characters: string[]): Token[] {
    const tokens: Token[] = [];
    for (let i = 0; i < characters.length; i++) {
      tokens.push(Token.recognize(characters[i]));
    }
    return tokens;
  }

  public static escapeStringCharacters(characters: string[]): string[] {
    const escaped: string[] = [];
    let concatChars: string[] = [];
    const flushConcatChars = () => {
      const concated = concatChars.join('').trim();
      if (concated.length) escaped.push(concated);
      concatChars = [];
    };
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      if (concatChars[0] === `"`) {
        concatChars.push(char);
        if (char === `"`) flushConcatChars(); // end string quote
      } else if (char === ' ') {
        flushConcatChars();
      } else {
        if (char === `"`) {
          flushConcatChars(); // start string quote
        }
        concatChars.push(char);
      }
    }
    flushConcatChars();
    return escaped;
  }

  private static TokenRecognizers: TokenRecognizers[] = [
    (c) => /^(\()$/.test(c) && new Token(LEFT_BRACKET, c),
    (c) => /^\)$/.test(c) && new Token(RIGHT_BRACKET, c),
    (c) => /^(and)$/.test(c) && new Token(OPERATOR, Operator.AND),
    (c) => /^(or)$/.test(c) && new Token(OPERATOR, Operator.OR),
    (c) => /^(=>)$/.test(c) && new Token(RESULT_POINTING, c),
    (c) => /^(!=)$/.test(c) && new Token(OPERATOR, Operator.NE),
    (c) => /^(<=)$/.test(c) && new Token(OPERATOR, Operator.LTE),
    (c) => /^(>=)$/.test(c) && new Token(OPERATOR, Operator.GTE),
    (c) => /^(==)$/.test(c) && new Token(OPERATOR, Operator.EQ),
    (c) => /^(<)$/.test(c) && new Token(OPERATOR, Operator.LT),
    (c) => /^(>)$/.test(c) && new Token(OPERATOR, Operator.GT),
    (c) => /^(-{0,1}[0-9]+(\.[0-9]+){0,1})$/.test(c) && new Token(NUMBER, c),
    (c) => /^(true|false)$/.test(c) && new Token(BOOL, c),
    (c) => /^"(([^"])*)"$/.test(c) && new Token(STRING, c),
    (c) => /^(([a-zA-Z]|_)((\w|_)*))$/.test(c) && new Token(VAR, c),
  ];
  constructor(public morpheme: Morpheme, public chars = '') {}

  unescapeSTRING() {
    const seq = this.chars.split('');
    seq.shift();
    seq.pop();
    return seq.join('');
  }

  toString() {
    return `Token<${this.morpheme},${this.chars}>`;
  }
}
