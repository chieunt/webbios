export class CacheService {
  constructor(
    private kv: KVNamespace, 
    private accountId: string, 
    private apiToken: string
  ) {}

  // Set cache (permanent, no TTL)
  async set(key: string, value: any): Promise<void> {
    await this.kv.put(`cache:${key}`, JSON.stringify(value));
  }

  // Get cache
  async get<T>(key: string): Promise<T | null> {
    const value = await this.kv.get(`cache:${key}`);
    return value ? JSON.parse(value) : null;
  }

  // Delete cache in KV and Purge CDN by Cache-Tag
  async invalidate(key: string): Promise<void> {
    // Tier 3: Delete KV
    await this.kv.delete(`cache:${key}`);
    // Tier 1+2: Purge CDN Cache by Cache-Tag
    await this.purgeCDN(`storefront:${key}`);
  }

  // Delete all storefront cache for a shop
  async invalidateAll(shopDomain: string): Promise<void> {
    await this.invalidate(`theme:config:${shopDomain}`);
    await this.invalidate(`theme:css:${shopDomain}`);
    await this.purgeCDN(`storefront:${shopDomain}`);
  }

  private async purgeCDN(tag: string): Promise<void> {
    // In production, we'll call Cloudflare API to purge by tag
    // For local dev, we just log it
    console.log(`[CacheService] Purged CDN Cache-Tag: ${tag}`);
    
    // Example CF API call (requires Zone ID which we might not have locally)
    /*
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags: [tag] })
    });
    */
  }
}
