import { Context, Expr, Rule } from '../grammar';
import { ExprParser, RuleParser } from './parse';
import { Token } from './tokenizer';

export class Facade {
  static buildRules(context: Context, ruleSources: string[]): Rule[] {
    const rules: Rule[] = [];
    ruleSources.forEach((ruleSource) => {
      const characters = Token.escapeStringCharacters(ruleSource.split(''));
      rules.push(new RuleParser(context, Token.newReader(Token.recognizeAll(characters))).build());
    });
    return rules;
  }

  static buildExpr(context: Context, exprSource: string): Expr {
    const characters = Token.escapeStringCharacters(exprSource.split(''));
    return new ExprParser(context, Token.newReader(Token.recognizeAll(characters))).build();
  }

  // static buildFromString(context: Context, str: string) {
  //   const characters = str.split(' ');
  //   const tokens: Token[] = [];
  //   for (let i = 0; i < characters.length; i++) {
  //     tokens.push(Token.recognize(characters[i]));
  //   }
  //   const reader = new (class implements TokenReader {
  //     charsReaded: string[] = [];
  //     offset = 0;
  //     read(): Token | null {
  //       const token = tokens[this.offset] ?? null;
  //       if (token) {
  //         this.offset++;
  //         this.charsReaded.push(token.chars);
  //       }
  //       return token;
  //     }
  //     rollback(): void {
  //       this.charsReaded.pop();
  //       this.offset--;
  //     }
  //     getCharsReaded = () => this.charsReaded.join(' ');
  //   })();
  //   try {
  //     const expr = new ExprParser(context, reader).build();
  //     return expr;
  //   } catch (e: any) {
  //     throw new WithCharsReadedError(reader.getCharsReaded(), e);
  //   }
  // }
}
