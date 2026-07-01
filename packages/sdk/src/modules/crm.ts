import { ApiClient } from '../client';

export interface Supplier {
  id: string;
  slug: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  import_mapping?: string;
  status?: 'active' | 'inactive' | 'archived';
  created_at?: string;
}

export interface ListSuppliersResponse {
  success: boolean;
  data: Supplier[];
  hasNextPage: boolean;
  error?: string;
}

export interface CreateSupplierResponse {
  success: boolean;
  data: Supplier;
  error?: string;
}

export interface CheckSlugResponse {
  success: boolean;
  slug?: string;
  error?: string;
}

export interface SupplierStatsResponse {
  success: boolean;
  data: {
    total?: number;
    status_active?: number;
    status_inactive?: number;
    status_archived?: number;
    [key: string]: number | undefined;
  };
  error?: string;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  seo_title?: string;
  seo_description?: string;
  status?: 'active' | 'inactive' | 'archived';
  created_at?: string;
}

export interface ListVendorsResponse {
  success: boolean;
  data: Vendor[];
  hasNextPage: boolean;
  error?: string;
}

export interface CreateVendorResponse {
  success: boolean;
  data: Vendor;
  error?: string;
}

export interface VendorStatsResponse {
  success: boolean;
  data: {
    total?: number;
    status_active?: number;
    status_inactive?: number;
    status_archived?: number;
    [key: string]: number | undefined;
  };
  error?: string;
}
export class CrmModule {
  constructor(private client: ApiClient) {}

  public suppliers = {
    list: async (params?: { search?: string; limit?: number; offset?: number; status?: 'active' | 'archived' | 'all' }): Promise<ListSuppliersResponse> => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.offset) query.append('offset', params.offset.toString());
      if (params?.status) query.append('status', params.status);
      
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return this.client.get(`/crm/suppliers${queryString}`);
    },
    
    create: async (data: Partial<Supplier>): Promise<CreateSupplierResponse> => {
      return this.client.post('/crm/suppliers', data);
    },
    
    update: async (id: string, data: Partial<Supplier>): Promise<CreateSupplierResponse> => {
      return this.client.put(`/crm/suppliers/${id}`, data);
    },

    delete: async (ids: string[]): Promise<{ success: boolean; error?: string }> => {
      return this.client.delete('/crm/suppliers', { body: JSON.stringify({ ids }) });
    },

    restore: async (ids: string[]): Promise<{ success: boolean; error?: string }> => {
      return this.client.post('/crm/suppliers/restore', { ids });
    },

    checkSlug: async (name: string, slug?: string, excludeId?: string): Promise<CheckSlugResponse> => {
      return this.client.post('/crm/suppliers/check-slug', { name, slug, excludeId });
    },

    stats: async (): Promise<SupplierStatsResponse> => {
      return this.client.get('/crm/suppliers/stats');
    }
  };

  public vendors = {
    list: async (params?: { search?: string; limit?: number; offset?: number; status?: 'active' | 'archived' | 'all' }): Promise<ListVendorsResponse> => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.offset) query.append('offset', params.offset.toString());
      if (params?.status) query.append('status', params.status);
      
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return this.client.get(`/crm/vendors${queryString}`);
    },
    
    create: async (data: Partial<Vendor>): Promise<CreateVendorResponse> => {
      return this.client.post('/crm/vendors', data);
    },
    
    update: async (id: string, data: Partial<Vendor>): Promise<CreateVendorResponse> => {
      return this.client.put(`/crm/vendors/${id}`, data);
    },

    delete: async (ids: string[]): Promise<{ success: boolean; error?: string }> => {
      return this.client.delete('/crm/vendors', { body: JSON.stringify({ ids }) });
    },

    restore: async (ids: string[]): Promise<{ success: boolean; error?: string }> => {
      return this.client.post('/crm/vendors/restore', { ids });
    },

    checkSlug: async (name: string, slug?: string, excludeId?: string): Promise<CheckSlugResponse> => {
      return this.client.post('/crm/vendors/check-slug', { name, slug, excludeId });
    },

    stats: async (): Promise<VendorStatsResponse> => {
      return this.client.get('/crm/vendors/stats');
    }
  };
}
