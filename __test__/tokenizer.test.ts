import { Token } from '../src/compiler/tokenizer';

test('should ignore redundant space chars', () => {
  const tokens = Token.recognizeAll('    ( age < 18 )    '.split(' '));
  expect(tokens.length).toBe(5);
});
