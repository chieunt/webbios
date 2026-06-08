import { ApiClient } from '../client';

export interface Shop {
  id: string;
  name: string;
  domain: string;
  status: string;
}

export interface License {
  id: string;
  key: string;
  type: string;
  status: string;
}

export interface WebbiOSUpdate {
  latest_version: string;
  release_notes: string;
  download_url: string;
  is_critical: boolean;
}

export class PlatformModule {
  constructor(private client: ApiClient) { }

  async getShops(): Promise<{ data: Shop[] }> {
    return this.client.get('/v1/shops');
  }

  async getLicenses(): Promise<{ data: License[] }> {
    return this.client.get('/v1/licenses');
  }

  async checkUpdate(currentVersion: string): Promise<WebbiOSUpdate> {
    return this.client.get(`/v1/updates/core?current_version=${currentVersion}`);
  }
}
