import dynamodb from './dynamodb';
import {table} from '../config/dynamodb';

export const getDevicePhone = async (deviceCode: string): Promise<string> => {
  const params = {
    TableName: table.DEVICE_PHONE,
    Key: {
      deviceCode,
    }
  };

  const result = await dynamodb.get(params).promise();

  return result.Item ? result.Item.phone : null;
}

export const setDevicePhone = (deviceCode: string, phone: string): Promise<any> => {
  const params = {
    TableName: table.DEVICE_PHONE,
    Item: {
      deviceCode,
      phone,
    }
  };

  return dynamodb.put(params).promise();
}