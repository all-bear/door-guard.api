import { getClient } from './dynamodb';
import { DEVICE_PHONE_TABLE } from '../constants/dynamodb';

export const getDevicePhone = async (deviceCode: string): Promise<string> => {
  const params = {
    TableName: DEVICE_PHONE_TABLE,
    Key: {
      deviceCode,
    }
  };

  const result = await getClient().get(params).promise();

  return result.Item ? result.Item.phone : null;
}

export const setDevicePhone = (deviceCode: string, phone: string): Promise<any> => {
  const params = {
    TableName: DEVICE_PHONE_TABLE,
    Item: {
      deviceCode,
      phone,
    }
  };

  return getClient().put(params).promise();
}