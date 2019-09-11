import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import dynamodb from '../api/dynamodb';
import { createAPIGatewayProxyHandler } from '../api/rest';
import { getDevicePhone, setDevicePhone } from '../api/device';

export const request: APIGatewayProxyHandler = createAPIGatewayProxyHandler(async (event, context) => {
  if (!event.pathParameters) {
    throw new Error('Invalid params');
  }

  const result = await getDevicePhone(event.pathParameters.deviceCode);

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
});

export const process: APIGatewayProxyHandler = createAPIGatewayProxyHandler(async (event, context) => {
  if (!event.pathParameters || !event.body) {
    throw new Error('Invalid params');
  }

  const payload = JSON.parse(event.body);
  await setDevicePhone(event.pathParameters.deviceCode, payload.phone);

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
});
