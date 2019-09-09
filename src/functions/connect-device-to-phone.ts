import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import dynamodb from '../api/dynamodb';
import {wrapError} from '../api/rest';
import {getDevicePhone, setDevicePhone} from '../api/device';

export const request: APIGatewayProxyHandler = async (event, context) => {
  try {
    if (!event.pathParameters) {
      return wrapError(new Error('Invalid params'));
    }

    const result = await getDevicePhone(event.pathParameters.deviceCode);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    return wrapError(err);
  }
};

export const process: APIGatewayProxyHandler = async (event, context) => {
  try {
    if (!event.pathParameters || !event.body) {
      return wrapError(new Error('Invalid params'))
    }

    const payload = JSON.parse(event.body);
    await setDevicePhone(event.pathParameters.deviceCode, payload.phone);

    return {
      statusCode: 200,
      body: JSON.stringify({})
    };
  } catch (err) {
    return wrapError(err);
  }
};
