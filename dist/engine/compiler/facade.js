"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facade = void 0;
const parse_1 = require("./parse");
const tokenizer_1 = require("./tokenizer");
class Facade {
    static buildRules(context, ruleSources) {
        const rules = [];
        ruleSources.forEach((ruleSource) => {
            const characters = tokenizer_1.Token.escapeStringCharacters(ruleSource.split(''));
            rules.push(new parse_1.RuleParser(context, tokenizer_1.Token.newReader(tokenizer_1.Token.recognizeAll(characters))).build());
        });
        return rules;
    }
    static buildExpr(context, exprSource) {
        const characters = tokenizer_1.Token.escapeStringCharacters(exprSource.split(''));
        return new parse_1.ExprParser(context, tokenizer_1.Token.newReader(tokenizer_1.Token.recognizeAll(characters))).build();
    }
}
exports.Facade = Facade;
