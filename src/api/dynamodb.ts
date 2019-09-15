import { createClientWrapper, AwsClientWrapper } from '../utils/aws';
import { DynamoDB } from 'aws-sdk';
import { IS_OFFLINE } from '../constants/offline';
import { LOCAL_ENDPOINT } from '../constants/dynamodb';

let options = {};

if (IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: LOCAL_ENDPOINT
  };
}

const clientWrapper: AwsClientWrapper<DynamoDB.DocumentClient> = createClientWrapper(() => new DynamoDB.DocumentClient(options));

export const { getClient, resetClient } = clientWrapper;