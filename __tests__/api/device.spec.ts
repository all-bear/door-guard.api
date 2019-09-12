import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { resetClient } from '~src/api/dynamodb';
import { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';
import { getDevicePhone, setDevicePhone } from '~src/api/device';
import { DEVICE_PHONE_TABLE } from '~src/constants/dynamodb';

const DYNAMODB_TABLE_DEVICE_PHONE = 'DYNAMODB_TABLE_DEVICE_PHONE';

beforeAll(() => {
  jest.resetModules();
  process.env.DYNAMODB_TABLE_DEVICE_PHONE = DYNAMODB_TABLE_DEVICE_PHONE;

  AWSMock.setSDKInstance(AWS);
});

describe('device api', () => {
  beforeEach(() => resetClient());

  it('should take device phone from database by device code', async () => {
    const deviceCode = 'test';
    const expectedPhone = '89898989'

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DEVICE_PHONE_TABLE);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, { Item: { phone: expectedPhone } });
    });

    expect(await getDevicePhone(deviceCode)).toBe(expectedPhone);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should set device phone into database by device code', async () => {
    const deviceCode = 'test1';
    const phone = '898989891';

    const expectedParams = { deviceCode, phone };

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: PutItemInput, callback: Function) => {
      expect(params.TableName).toBe(DEVICE_PHONE_TABLE);
      expect(params.Item).toStrictEqual(expectedParams);

      callback(null);
    });

    await setDevicePhone(deviceCode, phone);

    AWSMock.restore('DynamoDB.DocumentClient');
  })
});
