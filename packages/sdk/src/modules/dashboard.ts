import { ApiClient } from '../client';

/**
 * Provides methods for retrieving dashboard statistics and overviews.
 */
export class DashboardModule {
  constructor(private client: ApiClient) {}

  /**
   * Retrieves high-level dashboard statistics (e.g., total orders, revenue).
   * 
   * @returns A promise resolving to the dashboard statistics data.
   */
  async stats() {
    return this.client.get('/dashboard/stats');
  }
}
