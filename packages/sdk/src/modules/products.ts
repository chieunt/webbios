import { ApiClient } from '../client';

/**
 * Provides methods for managing products in the system.
 */
export class ProductsModule {
  constructor(private client: ApiClient) {}

  /**
   * Retrieves a paginated list of products.
   * 
   * @param params - Optional query parameters for filtering and pagination.
   * @returns A promise resolving to an array of products.
   */
  async list(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.client.get(`/products${query}`);
  }

  /**
   * Creates a new product in the system.
   * 
   * @param data - The product data to create.
   * @returns A promise resolving to the created product.
   */
  async create(data: any) {
    return this.client.post('/products', data);
  }
}
