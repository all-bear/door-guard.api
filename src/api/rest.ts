import { APIGatewayProxyResult, APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';

export const wrapError = (err: Error): APIGatewayProxyResult => {
  console.error(err);

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Something goes wrong', //TODO
    })
  }
}

type APIGatewayProxyHandlerWrapper = (
  handler: APIGatewayProxyHandlerWorker
) => APIGatewayProxyHandler;

type APIGatewayProxyHandlerWorker = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

export const createAPIGatewayProxyHandler: APIGatewayProxyHandlerWrapper =
  (handler: APIGatewayProxyHandlerWorker): APIGatewayProxyHandler =>
    async (event, context) => {
      try {
        return await handler(event, context);
      } catch (err) {
        return wrapError(err);
      }
    }