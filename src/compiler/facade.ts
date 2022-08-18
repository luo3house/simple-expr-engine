import { Context, Expr, Rule } from '../core/grammar';
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
}
