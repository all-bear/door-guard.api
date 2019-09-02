import {handler} from '~src/functions/hello';

describe('handler request', () => {
  it('should exists', () => {
    expect("test").toBe("Hello!");
  });
});
