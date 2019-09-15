import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createAPIGatewayProxyHandler } from '../api/rest';
import { generateDevice } from '../api/device';

export const handler: APIGatewayProxyHandler = createAPIGatewayProxyHandler(async (event, context) => {
  const { phone } = JSON.parse(event.body as string) as { phone: string }

  if (!phone) {
    throw new Error('Invalid phone');
  }

  const result = await generateDevice(phone);

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
});
