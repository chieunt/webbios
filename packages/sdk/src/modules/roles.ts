import { ApiClient } from '../client';

/**
 * Represents a role within the WebbiOS system.
 */
export interface Role {
  /** Unique identifier for the role (ULID) */
  id: string;
  /** Display name of the role (e.g., "Administrator") */
  name: string;
  /** Unique slug identifier for the role (e.g., "admin") */
  slug: string;
  /** Optional description explaining the purpose of the role */
  description: string | null;
  /** Indicates if this is a built-in system role that cannot be deleted */
  isSystem: boolean;
  /** ISO timestamp of when the role was created */
  createdAt: string;
}

/**
 * Module for interacting with the Roles API.
 * Provides methods for CRUD operations on roles and managing role permissions.
 */
export class RolesModule {
  /**
   * Initializes the RolesModule.
   * @param client The ApiClient instance used for making requests.
   */
  constructor(private client: ApiClient) {}

  /**
   * Fetches all available roles from the system.
   * 
   * @returns A promise that resolves to an object containing an array of Role objects.
   * @example
   * const response = await sdk.roles.getRoles();
   * console.log(response.data); // Array of roles
   */
  async getRoles(): Promise<{ data: Role[] }> {
    return this.client.get('/roles');
  }

  /**
   * Fetches the permission IDs assigned to a specific role.
   * 
   * @param id The unique identifier of the role.
   * @returns A promise that resolves to an object containing an array of permission IDs (strings).
   * @example
   * const response = await sdk.roles.getRolePermissions('role_123');
   * console.log(response.data); // ["users:read", "users:write"]
   */
  async getRolePermissions(id: string): Promise<{ data: string[] }> {
    return this.client.get(`/roles/${id}/permissions`);
  }

  /**
   * Creates a new role and optionally assigns permissions to it.
   * 
   * @param data The role details and optional permission IDs to assign upon creation.
   * @param data.name The display name of the new role.
   * @param data.slug A unique slug for the new role.
   * @param data.description An optional description for the role.
   * @param data.isSystem Set to true to create a system role (usually false for user-defined roles).
   * @param data.permissionIds An optional array of permission IDs to immediately assign to the role.
   * @returns A promise that resolves to the result of the creation operation.
   */
  async createRole(data: { name: string; slug: string; description?: string; isSystem?: boolean; permissionIds?: string[] }): Promise<{ success: boolean; data?: Role; error?: string }> {
    return this.client.post('/roles', data);
  }

  /**
   * Updates an existing role's details and replaces its assigned permissions.
   * 
   * @param id The unique identifier of the role to update.
   * @param data The updated role details and the new list of permission IDs.
   * @param data.name The updated display name.
   * @param data.slug The updated unique slug.
   * @param data.description The updated description.
   * @param data.isSystem Whether the role is marked as a system role.
   * @param data.permissionIds The new complete list of permission IDs to assign to the role (overwrites existing).
   * @returns A promise that resolves to the result of the update operation.
   */
  async updateRole(id: string, data: { name: string; slug: string; description?: string; isSystem?: boolean; permissionIds?: string[] }): Promise<{ success: boolean; error?: string }> {
    return this.client.put(`/roles/${id}`, data);
  }

  /**
   * Deletes a role from the system.
   * Note: System roles typically should not be deleted.
   * 
   * @param id The unique identifier of the role to delete.
   * @returns A promise that resolves to the result of the deletion operation.
   */
  async deleteRole(id: string): Promise<{ success: boolean; error?: string }> {
    return this.client.delete(`/roles/${id}`);
  }
}
