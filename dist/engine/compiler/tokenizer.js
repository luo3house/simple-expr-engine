"use strict";
// 词法分析
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.Morpheme = exports.TokenizerErrors = void 0;
const grammar_1 = require("../grammar");
var TokenizerErrors;
(function (TokenizerErrors) {
    class TokenNotRecognizeError extends Error {
        constructor(chars) {
            super(`unrecognized token: ${chars}`);
        }
    }
    TokenizerErrors.TokenNotRecognizeError = TokenNotRecognizeError;
})(TokenizerErrors = exports.TokenizerErrors || (exports.TokenizerErrors = {}));
var Morpheme;
(function (Morpheme) {
    Morpheme[Morpheme["LEFT_BRACKET"] = 0] = "LEFT_BRACKET";
    Morpheme[Morpheme["RIGHT_BRACKET"] = 1] = "RIGHT_BRACKET";
    Morpheme[Morpheme["VAR"] = 2] = "VAR";
    Morpheme[Morpheme["OPERATOR"] = 3] = "OPERATOR";
    Morpheme[Morpheme["RESULT_POINTING"] = 4] = "RESULT_POINTING";
    Morpheme[Morpheme["BOOL"] = 5] = "BOOL";
    Morpheme[Morpheme["NUMBER"] = 6] = "NUMBER";
    Morpheme[Morpheme["STRING"] = 7] = "STRING";
})(Morpheme = exports.Morpheme || (exports.Morpheme = {}));
const { LEFT_BRACKET, RIGHT_BRACKET, VAR, RESULT_POINTING, BOOL, NUMBER, STRING, OPERATOR } = Morpheme;
class Token {
    constructor(morpheme, chars = '') {
        this.morpheme = morpheme;
        this.chars = chars;
    }
    static newReader(tokens) {
        return new (class {
            constructor() {
                this.charsReaded = [];
                this.offset = 0;
                this.getCharsReaded = () => this.charsReaded.join(' ');
            }
            read() {
                var _a;
                const token = (_a = tokens[this.offset]) !== null && _a !== void 0 ? _a : null;
                if (token) {
                    this.offset++;
                    this.charsReaded.push(token.chars);
                }
                return token;
            }
            rollback() {
                this.charsReaded.pop();
                this.offset--;
            }
        })();
    }
    static recognize(tkn) {
        for (let i = 0; i < this.TokenRecognizers.length; i++) {
            const token = this.TokenRecognizers[i](tkn);
            if (token !== false) {
                return token;
            }
        }
        throw new TokenizerErrors.TokenNotRecognizeError(tkn);
    }
    static recognizeAll(characters) {
        const tokens = [];
        for (let i = 0; i < characters.length; i++) {
            tokens.push(Token.recognize(characters[i]));
        }
        return tokens;
    }
    static escapeStringCharacters(characters) {
        const escaped = [];
        let concatChars = [];
        const flushConcatChars = () => {
            const concated = concatChars.join('').trim();
            if (concated.length)
                escaped.push(concated);
            concatChars = [];
        };
        for (let i = 0; i < characters.length; i++) {
            const char = characters[i];
            if (concatChars[0] === `"`) {
                concatChars.push(char);
                if (char === `"`)
                    flushConcatChars(); // end string quote
            }
            else if (char === ' ') {
                flushConcatChars();
            }
            else {
                if (char === `"`) {
                    flushConcatChars(); // start string quote
                }
                concatChars.push(char);
            }
        }
        flushConcatChars();
        return escaped;
    }
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
exports.Token = Token;
Token.TokenRecognizers = [
    (c) => /^(\()$/.test(c) && new Token(LEFT_BRACKET, c),
    (c) => /^\)$/.test(c) && new Token(RIGHT_BRACKET, c),
    (c) => /^(and)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.AND),
    (c) => /^(or)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.OR),
    (c) => /^(=>)$/.test(c) && new Token(RESULT_POINTING, c),
    (c) => /^(!=)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.NE),
    (c) => /^(<=)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.LTE),
    (c) => /^(>=)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.GTE),
    (c) => /^(==)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.EQ),
    (c) => /^(<)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.LT),
    (c) => /^(>)$/.test(c) && new Token(OPERATOR, grammar_1.Operator.GT),
    (c) => /^(-{0,1}[0-9]+(\.[0-9]+){0,1})$/.test(c) && new Token(NUMBER, c),
    (c) => /^(true|false)$/.test(c) && new Token(BOOL, c),
    (c) => /^"(([^"])*)"$/.test(c) && new Token(STRING, c),
    (c) => /^(([a-zA-Z]|_)((\w|_)*))$/.test(c) && new Token(VAR, c),
];
