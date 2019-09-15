import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createAPIGatewayProxyHandler } from '../api/rest';
import { getDevicePhone, setDevicePhone } from '../api/device';

export const request: APIGatewayProxyHandler = createAPIGatewayProxyHandler(async (event, context) => {
  const { deviceCode } = event.pathParameters as { deviceCode: string };

  if (!deviceCode) {
    throw new Error('Invalid device code');
  }

  const result = await getDevicePhone(deviceCode);

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
});

export const process: APIGatewayProxyHandler = createAPIGatewayProxyHandler(async (event, context) => {
  const { deviceCode } = event.pathParameters as { deviceCode: string };
  const { phone } = JSON.parse(event.body as string) as { phone: string }

  if (!phone || !deviceCode) {
    throw new Error('Invalid device code or phone');
  }

  await setDevicePhone(deviceCode, phone);

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
});
