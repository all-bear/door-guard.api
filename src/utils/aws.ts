export interface AwsClientWrapper<Client> {
  getClient: () => Client,
  resetClient: () => void
}

export function createClientWrapper<Client>(createClient: () => Client): AwsClientWrapper<Client> {
  let client: Client | null = null;

  return {
    resetClient: () => {client = null},
    getClient: () => {
      if (!client) {
        client = createClient();
      }
    
      return client;
    }
  }
}