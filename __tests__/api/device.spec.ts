import { resetClient } from '~src/api/dynamodb';
import { GetItemInput, PutItemInput, TransactWriteItemsInput } from 'aws-sdk/clients/dynamodb';
import { Device } from '~src/types/device';

const DYNAMODB_TABLE_DEVICE_PHONE = 'DYNAMODB_TABLE_DEVICE_PHONE';
const DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN = 'DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN';

describe('device api', () => {
  let deviceApi;
  // tslint:disable-next-line:variable-name
  let AWSMock;
  let AWS;

  beforeEach(() => {
    jest.resetModules();

    AWSMock = require('aws-sdk-mock');
    AWS = require('aws-sdk');

    AWSMock.setSDKInstance(AWS);

    process.env.DYNAMODB_TABLE_DEVICE_PHONE = DYNAMODB_TABLE_DEVICE_PHONE;
    process.env.DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN = DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN;

    deviceApi = require('~src/api/device');

    resetClient();
  });

  it('should take device phone from database by device code', async () => {
    const deviceCode = 'test';
    const expectedPhone = '89898989';

    const getMock = jest.fn((params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DYNAMODB_TABLE_DEVICE_PHONE);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, { Item: { phone: expectedPhone } });
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);

    expect(await deviceApi.getDevicePhone(deviceCode)).toBe(expectedPhone);
    expect(getMock.mock.calls.length).toBe(1);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should set device phone into database by device code', async () => {
    const deviceCode = 'test1';
    const phone = '898989891';

    const expectedParams = { deviceCode, phone };

    const putMock = jest.fn((params: PutItemInput, callback: Function) => {
      expect(params.TableName).toBe(DYNAMODB_TABLE_DEVICE_PHONE);
      expect(params.Item).toStrictEqual(expectedParams);

      callback(null);
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'put', putMock);

    await deviceApi.setDevicePhone(deviceCode, phone);
    expect(putMock.mock.calls.length).toBe(1);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should validate device request token with database value by device code', async () => {
    const deviceCode = 'test';
    const dbRequestToken = 'abracadabra';
    const correctRequestToken = dbRequestToken;
    const wrontRequestToken = 'somehackervalue';

    const getMock = jest.fn((params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, { Item: { requestToken: dbRequestToken } });
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);

    expect(await deviceApi.isRequestTokenValid(deviceCode, correctRequestToken)).toBe(true);
    expect(await deviceApi.isRequestTokenValid(deviceCode, wrontRequestToken)).toBe(false);

    expect(getMock.mock.calls.length).toBe(2);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should validate as falsy request token which is not inside of db by device code', async () => {
    const deviceCode = 'test';
    const wrontRequestToken = 'somehackervalue';

    const getMock = jest.fn((params: GetItemInput, callback: Function) => {
      expect(params.TableName).toBe(DYNAMODB_TABLE_DEVICE_REQUEST_TOKEN);
      expect(params.Key.deviceCode).toBe(deviceCode);

      callback(null, {});
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'get', getMock);

    expect(await deviceApi.isRequestTokenValid(deviceCode, wrontRequestToken)).toBe(false);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should create device with generated device request token and device code by phone number', async () => {
    const phone1 = '848484';
    const phone2 = '848484';

    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params: TransactWriteItemsInput, callback: Function) => callback(null));

    const device1 = await deviceApi.generateDevice(phone1);
    const device2 = await deviceApi.generateDevice(phone2);

    expect(device1.deviceCode).not.toBe(device2.deviceCode);
    expect(device1.requestToken).not.toBe(device2.requestToken);

    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should store device in db during device generation', async () => {
    const phone = '848484';

    const putMock = jest.fn((params: TransactWriteItemsInput, callback: Function) => callback(null));
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', putMock);

    const device = await deviceApi.generateDevice(phone);

    // TODO not sure how to check this correctly without high depend on db requests
    expect(putMock.mock.calls.length).toBe(1);

    AWSMock.restore('DynamoDB.DocumentClient');
  });
});
