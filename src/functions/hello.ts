import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import dynamodb from '~src/api/dynamodb';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_DEVICE_PHONE,
  } as {TableName: string};

  try {
    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    }
  } catch (err) {
    console.log(err, process.env.DYNAMODB_TABLE_DEVICE_PHONE);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the todo item.',
    }
  }
};
