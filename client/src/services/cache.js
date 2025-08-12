// Simple in-memory cache with TTL
class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 300000) { // Default TTL: 5 minutes
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });

    // Optional: Schedule cleanup
    setTimeout(() => this.delete(key), ttl);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (item.expiry <= Date.now()) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

const globalCache = new Cache();
export default globalCache;
