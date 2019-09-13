import { getClient } from './dynamodb';
import { DEVICE_PHONE_TABLE, DEVICE_REQUEST_TOKEN_TABLE } from '../constants/dynamodb';

export const getDevicePhone = async (deviceCode: string): Promise<string> => {
  const params = {
    TableName: DEVICE_PHONE_TABLE,
    Key: {
      deviceCode
    }
  };

  const result = await getClient().get(params).promise();

  return result.Item ? result.Item.phone : null;
};

export const setDevicePhone = async (deviceCode: string, phone: string): Promise<void> => {
  const params = {
    TableName: DEVICE_PHONE_TABLE,
    Item: {
      deviceCode,
      phone
    }
  };

  await getClient().put(params).promise();
};

export const isRequestTokenValid = async (deviceCode: string, requestToken: string): Promise<boolean> => {
  const params = {
    TableName: DEVICE_REQUEST_TOKEN_TABLE,
    Key: {
      deviceCode
    }
  };

  const result = await getClient().get(params).promise();

  return result.Item ? result.Item.requestToken === requestToken : false;
};
