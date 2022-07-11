import { Parser } from '../src/engine/compiler/parse';
import { Interpreter } from '../src/engine/compiler/interpret';
import { Token } from '../src/engine/compiler/tokenizer';
import { Variable, VariableStore } from '../src/engine/variable';

test('true <> false', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineBOOL('switch', false), //
    ]),
  };
  const chars = `( switch = true )`.split(' ');
  const reader = Token.newReader(Token.recognizeAll(chars));
  const expr = new Parser(context, reader).build();
  expect(Interpreter.interpret(expr)).toBe(false);
});

test('1 = true', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineNUMBER('level', 1), //
    ]),
  };
  const chars = `( level = true )`.split(' ');
  const reader = Token.newReader(Token.recognizeAll(chars));
  const expr = new Parser(context, reader).build();
  expect(Interpreter.interpret(expr)).toBe(true);
});

test('ε = false', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineSTRING('orderId', ''), //
    ]),
  };
  const chars = `( orderId <> true )`.split(' ');
  const reader = Token.newReader(Token.recognizeAll(chars));
  const expr = new Parser(context, reader).build();
  expect(Interpreter.interpret(expr)).toBe(true);
});

test('integer constant preset', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineNUMBER('order_status', -1),
      Variable.defineNUMBER('OrderStatus_Created', 0),
      Variable.defineNUMBER('OrderStatus_Paid', 1),
      Variable.defineNUMBER('OrderStatus_Exception', -1),
    ]),
  };
  const chars = `( order_status = OrderStatus_Exception )`.split(' ');
  const reader = Token.newReader(Token.recognizeAll(chars));
  const expr = new Parser(context, reader).build();
  expect(Interpreter.interpret(expr)).toBe(true);
});
