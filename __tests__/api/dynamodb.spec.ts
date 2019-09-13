import { DynamoDB } from 'aws-sdk';
import { getClient, resetClient } from '~src/api/dynamodb';

describe('dynamodb api', () => {
  it('should create document client', () => {
    expect(getClient()).toBeInstanceOf(DynamoDB.DocumentClient);
  });

  it('should cache document client', () => {
    const client = getClient();

    expect(getClient()).toBe(client);
  });

  it('should reset document client by request', () => {
    const client = getClient();

    resetClient();

    expect(getClient()).not.toBe(client);
  });
});
