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

    const getMock = jest.fn((params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DEVICE_PHONE_TABLE);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, { Item: { phone: expectedPhone } });
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);

    expect(await getDevicePhone(deviceCode)).toBe(expectedPhone);
    expect(getMock.mock.calls.length).toBe(1);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should set device phone into database by device code', async () => {
    const deviceCode = 'test1';
    const phone = '898989891';

    const expectedParams = { deviceCode, phone };

    const putMock = jest.fn((params: PutItemInput, callback: Function) => {
      expect(params.TableName).toBe(DEVICE_PHONE_TABLE);
      expect(params.Item).toStrictEqual(expectedParams);

      callback(null);
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'put', putMock);

    await setDevicePhone(deviceCode, phone);
    expect(putMock.mock.calls.length).toBe(1);

    AWSMock.restore('DynamoDB.DocumentClient');
  })
});
