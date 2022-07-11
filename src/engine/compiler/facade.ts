import { Context } from '../grammar';
import { Parser, TokenReader } from './parse';
import { WithCharsReadedError } from '../errors';
import { Token } from './tokenizer';

export class Facade {
  static buildFromString(context: Context, str: string) {
    const characters = str.split(' ');
    const tokens: Token[] = [];
    for (let i = 0; i < characters.length; i++) {
      tokens.push(Token.recognize(characters[i]));
    }
    const reader = new (class implements TokenReader {
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
    try {
      const expr = new Parser(context, reader).build();
      return expr;
    } catch (e: any) {
      throw new WithCharsReadedError(reader.getCharsReaded(), e);
    }
  }
}
