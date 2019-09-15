import { createClientWrapper, AwsClientWrapper } from '../utils/aws';
import { Iot } from 'aws-sdk';

let options = {};

const clientWrapper: AwsClientWrapper<Iot> = createClientWrapper(() => new Iot(options));

export const { getClient, resetClient } = clientWrapper;