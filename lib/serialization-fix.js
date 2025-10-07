// Safe serialization for server components
export function safeSerialize(data) {
  if (data === null || data === undefined) return null;
  if (typeof data !== 'object') return data;
  
  if (Array.isArray(data)) {
    return data.map(item => safeSerialize(item));
  }
  
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    try {
      // Skip React components and functions
      if (typeof value === 'function') continue;
      if (value?.$$typeof) continue;
      
      if (value instanceof Date) {
        clean[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = safeSerialize(value);
      } else {
        clean[key] = value;
      }
    } catch {
      // Skip problematic properties
      continue;
    }
  }
  return clean;
}
