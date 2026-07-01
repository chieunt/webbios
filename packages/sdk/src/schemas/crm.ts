import { z } from 'zod';

export const SupplierSchema = z.object({
  name: z.string().min(2, 'suppliers.validation.nameMin'),
  slug: z.string().min(1, 'suppliers.validation.slugRequired'),
  contact_name: z.string().optional(),
  email: z.string().email('suppliers.validation.emailInvalid').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[0-9\s-]{9,15}$/, 'suppliers.validation.phoneInvalid').optional().or(z.literal('')),
  address: z.string().optional(),
  import_mapping: z.string().optional(),
});

export type SupplierInput = z.infer<typeof SupplierSchema>;

export const VendorSchema = z.object({
  name: z.string().min(2, 'vendors.validation.nameMin'),
  slug: z.string().min(1, 'vendors.validation.slugRequired'),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  website: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type VendorInput = z.infer<typeof VendorSchema>;
