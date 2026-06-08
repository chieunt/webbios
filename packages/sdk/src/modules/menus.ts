import { ApiClient } from '../client';

/**
 * Interface representing a dynamic menu item.
 */
export interface MenuItem {
  id: string;
  label: string;
  translations?: any;
  path: string | null;
  icon: string | null;
  parentId: string | null;
  permissionSlug: string | null;
  position: number;
  isVisible: boolean;
  isSystem: boolean;
  isBeta?: boolean;
  children?: MenuItem[];
}

/**
 * Provides methods to retrieve navigation menus.
 */
export class MenusModule {
  constructor(private client: ApiClient) {}

  /**
   * Retrieves the hierarchical list of navigation menus based on user permissions.
   * 
   * @returns A promise resolving to an array of MenuItem trees.
   */
  async getMenus(): Promise<{ data: MenuItem[] }> {
    return this.client.get('/menus');
  }

  /**
   * Creates a new menu item.
   * @param data The menu item data.
   */
  async createMenu(data: any): Promise<{ success: boolean, data: MenuItem }> {
    return this.client.post('/menus', data);
  }

  /**
   * Updates an existing menu item.
   * @param id The ID of the menu item.
   * @param data The updated data.
   */
  async updateMenu(id: string, data: any): Promise<{ success: boolean }> {
    return this.client.put(`/menus/${id}`, data);
  }

  /**
   * Deletes a menu item.
   * @param id The ID of the menu item.
   */
  async deleteMenu(id: string): Promise<{ success: boolean }> {
    return this.client.delete(`/menus/${id}`);
  }

  /**
   * Batch reorder menus - updates parentId and position for multiple items at once.
   * @param items Array of {id, parentId, position}
   */
  async reorderMenus(items: { id: string, parentId: string | null, position: number }[]): Promise<{ success: boolean }> {
    return this.client.post('/menus/reorder', { items });
  }
}
