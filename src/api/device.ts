import { getClient } from './dynamodb';
import { DEVICE_PHONE_TABLE, DEVICE_REQUEST_TOKEN_TABLE } from '../constants/dynamodb';
import { Device } from '../types/device';
import { v4 as uuid } from 'uuid';

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

const createDevice = (phone: string): Device => ({
  phone,
  deviceCode: uuid(),
  requestToken: uuid()
});

const saveDevice = async (device: Device) => {
  const params = {
    TransactItems: [
      {
        Put: {
          TableName: DEVICE_PHONE_TABLE,
          Item: {
            deviceCode: device.deviceCode,
            phone: device.phone
          }
        }
      },
      {
        Put: {
          TableName: DEVICE_REQUEST_TOKEN_TABLE,
          Item: {
            deviceCode: device.deviceCode,
            phone: device.requestToken
          }
        }
      }
    ]
  };

  await getClient().transactWrite(params).promise();
};

export const generateDevice = async (phone: string): Promise<Device> => {
  const device = createDevice(phone);

  await saveDevice(device);

  return device;
};
