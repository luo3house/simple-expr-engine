import { TokenReader } from './parse';
export declare module TokenizerErrors {
    class TokenNotRecognizeError extends Error {
        constructor(chars: string);
    }
}
export declare enum Morpheme {
    LEFT_BRACKET = 0,
    RIGHT_BRACKET = 1,
    VAR = 2,
    OPERATOR = 3,
    RESULT_POINTING = 4,
    BOOL = 5,
    NUMBER = 6,
    STRING = 7
}
export declare class Token {
    morpheme: Morpheme;
    chars: string;
    static newReader(tokens: Token[]): TokenReader;
    static recognize(tkn: string): Token;
    static recognizeAll(characters: string[]): Token[];
    static escapeStringCharacters(characters: string[]): string[];
    private static TokenRecognizers;
    constructor(morpheme: Morpheme, chars?: string);
    unescapeSTRING(): string;
    toString(): string;
}
