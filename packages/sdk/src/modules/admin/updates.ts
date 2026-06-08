import { ApiClient } from '../../client';

export class AdminUpdatesClient {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Request to install an update for Core or App
   */
  async installUpdate(payload: { shopId: string; version: string; targetId: string; type: string; previousVersion?: string }) {
    return this.client.post('/updates/install', payload);
  }
}
