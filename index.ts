import { Facade } from './engine/compiler/facade';

import { InterpretErrors } from './engine/compiler/interpret';
import { Interpreter } from './engine/compiler/interpret';

import { ParseErrors } from './engine/compiler/parse';
import { TokenReader } from './engine/compiler/parse';
import { ExprParser } from './engine/compiler/parse';
import { RuleParser } from './engine/compiler/parse';

import { SemanticErrors } from './engine/compiler/semantic';
import { Context } from './engine/compiler/semantic';
import { Semantic } from './engine/compiler/semantic';

import { TokenizerErrors } from './engine/compiler/tokenizer';
import { Morpheme } from './engine/compiler/tokenizer';
import { Token } from './engine/compiler/tokenizer';

// facade
export { Facade };

// interpret
export { InterpretErrors };
export const { NoRuleResultError } = InterpretErrors;
export { Interpreter };

// parse
export { ParseErrors };
export const { UnexpectedMorphemeError, UnexpectedEOFError } = ParseErrors;
export { TokenReader };
export { ExprParser };
export { RuleParser };

// semantic
export { SemanticErrors };
export const { OpNotMatchError, VariableNotFoundError } = SemanticErrors;
export { Context };
export { Semantic };

// tokenizer
export { TokenizerErrors };
export const { TokenNotRecognizeError } = TokenizerErrors;
export { Morpheme };
export { Token };
