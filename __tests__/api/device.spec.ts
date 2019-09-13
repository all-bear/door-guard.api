import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { resetClient } from '~src/api/dynamodb';
import { GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';
import { getDevicePhone, setDevicePhone, isRequestTokenValid } from '~src/api/device';
import { DEVICE_PHONE_TABLE, DEVICE_REQUEST_TOKEN_TABLE } from '~src/constants/dynamodb';

const DYNAMODB_TABLE_DEVICE_PHONE = 'DYNAMODB_TABLE_DEVICE_PHONE';
const DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN = 'DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN';

beforeAll(() => {
  jest.resetModules();
  process.env.DYNAMODB_TABLE_DEVICE_PHONE = DYNAMODB_TABLE_DEVICE_PHONE;
  process.env.DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN = DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN;

  AWSMock.setSDKInstance(AWS);
});

describe('device api', () => {
  beforeEach(() => resetClient());

  it('should take device phone from database by device code', async () => {
    const deviceCode = 'test';
    const expectedPhone = '89898989';

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
  });

  it('should validate device request token with database value by device code', async () => {
    const deviceCode = 'test';
    const dbRequestToken = 'abracadabra';
    const correctRequestToken = dbRequestToken;
    const wrontRequestToken = 'somehackervalue';

    const getMock = jest.fn((params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DEVICE_REQUEST_TOKEN_TABLE);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, { Item: { requestToken: dbRequestToken } });
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);

    expect(await isRequestTokenValid(deviceCode, correctRequestToken)).toBe(true);
    expect(await isRequestTokenValid(deviceCode, wrontRequestToken)).toBe(false);

    expect(getMock.mock.calls.length).toBe(2);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should validate as falsy request token which is not inside of db by device code', async () => {
    const deviceCode = 'test';
    const wrontRequestToken = 'somehackervalue';

    const getMock = jest.fn((params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DEVICE_REQUEST_TOKEN_TABLE);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, {});
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);

    expect(await isRequestTokenValid(deviceCode, wrontRequestToken)).toBe(false);

    AWSMock.restore('DynamoDB.DocumentClient');
  });
});
