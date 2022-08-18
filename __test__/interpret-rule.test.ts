import { Interpreter } from '../src/compiler/interpret';
import { Variable, VariableStore } from '../src/core/variable';
import { Facade } from '../src/compiler/facade';

test('all constant values', () => {
  const context = {
    variableStore: new VariableStore([]),
  };
  const source = `( true == true ) => 2022`;
  const rules = Facade.buildRules(context, [source]);
  expect(Interpreter.interpretRules(rules).valueHolder.asNumber()).toBe(2022);
});

test('as variable', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineNUMBER('pm25', 80),
      Variable.defineNUMBER('RESULT_OK', 0),
      Variable.defineNUMBER('RESULT_WARN', -1),
    ]),
  };
  const sources = [
    `( pm25 > 75 ) => RESULT_WARN`, //
    `( true == true ) => RESULT_OK`,
  ];
  const rules = Facade.buildRules(context, sources);
  expect(Interpreter.interpretRules(rules).valueHolder.asNumber()).toBe(-1);
});

test('business', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineSTRING('level', 'gold'),
      Variable.defineSTRING('GUEST_LEVEL_BRONZE', 'bronze'),
      Variable.defineSTRING('GUEST_LEVEL_SILVER', 'silver'),
      Variable.defineSTRING('GUEST_LEVEL_GOLD', 'gold'),
      Variable.defineSTRING('GUEST_LEVEL_NONE', 'none'),
    ]),
  };
  const sources = [
    `( level == GUEST_LEVEL_GOLD ) => 75`,
    `( level == GUEST_LEVEL_SILVER ) => 80`,
    `( level == GUEST_LEVEL_BRONZE ) => 90`,
  ];
  const rules = Facade.buildRules(context, sources);
  expect(Interpreter.interpretRules(rules).valueHolder.asNumber()).toBe(75);
});

test('no result', () => {
  const context = {
    variableStore: new VariableStore([
      Variable.defineSTRING('level', 'none'),
      Variable.defineSTRING('GUEST_LEVEL_BRONZE', 'bronze'),
      Variable.defineSTRING('GUEST_LEVEL_SILVER', 'silver'),
      Variable.defineSTRING('GUEST_LEVEL_GOLD', 'gold'),
      Variable.defineSTRING('GUEST_LEVEL_NONE', 'none'),
    ]),
  };
  const sources = [
    `( level == GUEST_LEVEL_GOLD ) => 75`,
    `( level == GUEST_LEVEL_SILVER ) => 80`,
    `( level == GUEST_LEVEL_BRONZE ) => 90`,
  ];
  const rules = Facade.buildRules(context, sources);
  // const { NoRuleResultError } = require('..')
  expect(() => Interpreter.interpretRules(rules)).toThrow('no rule result');
});
