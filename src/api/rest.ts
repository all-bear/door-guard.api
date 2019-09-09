import { APIGatewayProxyResult } from 'aws-lambda';

export const wrapError = (err: Error): APIGatewayProxyResult => {
  console.error(err);

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Something goes wrong', //TODO
    })
  }
}