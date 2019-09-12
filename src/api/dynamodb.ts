import { DynamoDB } from 'aws-sdk';
import { IS_OFFLINE } from '../constants/offline';
import { LOCAL_ENDPOINT } from '../constants/dynamodb';

let client: DynamoDB.DocumentClient | null = null;
let options = {};

if (IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: LOCAL_ENDPOINT
  };
}

const createClient = () => new DynamoDB.DocumentClient(options);

export const resetClient = () => {
  client = null;
}

export const getClient = () => {
  if (!client) {
    client = createClient();
  }

  return client;
}