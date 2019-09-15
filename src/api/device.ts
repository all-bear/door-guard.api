import { getClient as getDynamodbClient } from './dynamodb';
import { getClient as getIotClient } from './iot';
import { DEVICE_PHONE_TABLE, DEVICE_REQUEST_TOKEN_TABLE } from '../constants/dynamodb';
import { Device } from '../types/device';
import { v4 as uuid } from 'uuid';
import { Iot } from 'aws-sdk';

export const getDevicePhone = async (deviceCode: string): Promise<string> => {

  const params = {
    TableName: DEVICE_PHONE_TABLE,
    Key: {
      deviceCode
    }
  };

  const result = await getDynamodbClient().get(params).promise();

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

  await getDynamodbClient().put(params).promise();
};

export const isRequestTokenValid = async (deviceCode: string, requestToken: string): Promise<boolean> => {
  const params = {
    TableName: DEVICE_REQUEST_TOKEN_TABLE,
    Key: {
      deviceCode
    }
  };

  const result = await getDynamodbClient().get(params).promise();

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

  await getDynamodbClient().transactWrite(params).promise();
};

const registerDevice = async (device: Device) => {
  const params = {
    thingName: device.deviceCode,
    attributePayload: {
      attributes: {
        isDoorOpened: '0',
        requestToken: device.requestToken,
      }
    }
  }

  await getIotClient().createThing(params).promise();
}

export const generateDevice = async (phone: string): Promise<Device> => {
  const device = createDevice(phone);

  await saveDevice(device);
  await registerDevice(device);

  return device;
};
