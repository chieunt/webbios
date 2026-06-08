import { ApiClient } from '../client';

/**
 * Interface representing a system permission.
 */
export interface Permission {
  /** Unique identifier for the permission */
  id: string;
  /** A unique slug representing the permission (e.g. 'users:read') */
  slug: string;
  /** Human-readable description of what this permission grants */
  description: string | null;
  /** ISO date string of when the permission was created */
  createdAt: string;
}

/**
 * Provides methods to retrieve and manage system permissions.
 */
export class PermissionsModule {
  constructor(private client: ApiClient) {}

  /**
   * Retrieves the full list of system permissions.
   * 
   * @returns A promise resolving to an array of Permissions.
   */
  async getPermissions(): Promise<{ data: Permission[] }> {
    return this.client.get('/permissions');
  }

  /**
   * Creates a new system permission.
   * 
   * @param data The permission data (must contain 'slug').
   */
  async createPermission(data: any): Promise<{ success: boolean, data: Permission }> {
    return this.client.post('/permissions', data);
  }

  /**
   * Updates an existing permission.
   * 
   * @param id The ID of the permission.
   * @param data The updated data (e.g. 'description').
   */
  async updatePermission(id: string, data: any): Promise<{ success: boolean }> {
    return this.client.put(`/permissions/${id}`, data);
  }

  /**
   * Deletes a permission. Will fail if the permission is still in use by a role or menu.
   * 
   * @param id The ID of the permission to delete.
   */
  async deletePermission(id: string): Promise<{ success: boolean }> {
    return this.client.delete(`/permissions/${id}`);
  }
}
