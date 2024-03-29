import { Interpreter } from '../src/compiler/interpret';
import { Variable, VariableStore } from '../src/core/variable';
import { Facade } from '../src/compiler/facade';

test('true != false', () => {
  const context = {
    variableStore: new VariableStore([]),
  };
  const source = `( false == true )`;
  const expr = Facade.buildExpr(context, source);
  expect(Interpreter.interpretExpr(expr)).toBe(false);
});

test('inline flatten expr', () => {
  const context = {
    variableStore: new VariableStore([]),
  };
  {
    const source = `( ( true == true ) and ( true == true ) and ( 1 == 1 ) and ( 2 == 2 ) and ( false == true ) )`;
    const expr = Facade.buildExpr(context, source);
    expect(Interpreter.interpretExpr(expr)).toBe(false);
  }
  {
    const source = `( ( true == false ) or ( 2 == 1 ) )`;
    const expr = Facade.buildExpr(context, source);
    expect(Interpreter.interpretExpr(expr)).toBe(false);
  }
});

test('1 == true', () => {
  const context = {
    variableStore: new VariableStore([]),
  };
  const source = `( 1 == true )`;
  const expr = Facade.buildExpr(context, source);
  expect(Interpreter.interpretExpr(expr)).toBe(true);
});

test('ε = false', () => {
  const context = {
    variableStore: new VariableStore([]),
  };
  const source = `( "" != true )`;
  const expr = Facade.buildExpr(context, source);
  expect(Interpreter.interpretExpr(expr)).toBe(true);
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
  const source = `( order_status == OrderStatus_Exception )`;
  const expr = Facade.buildExpr(context, source);
  expect(Interpreter.interpretExpr(expr)).toBe(true);
});

test('blank in string', () => {
  const context = {
    variableStore: new VariableStore([]),
  };
  const source = `( "hello world" == "hello world" )`;
  const expr = Facade.buildExpr(context, source);
  expect(Interpreter.interpretExpr(expr)).toBe(true);
});
