import { handler } from '~src/functions/hello';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('handler request', () => {
  it('should exists', () => {
    handler({} as APIGatewayProxyEvent, {} as Context, jest.fn());
  });
});
