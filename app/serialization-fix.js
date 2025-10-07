// NUCLEAR SERIALIZATION FIX
export function nuclearSerialization(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => {
      try {
        return nuclearSerialization(item);
      } catch {
        return null;
      }
    }).filter(item => item !== undefined);
  }
  
  // Handle objects - aggressively remove problematic properties
  const safeObj = {};
  const skipKeys = ['then', 'catch', 'finally', 'constructor', 'prototype', 'render', 'type', 'props', 'ref'];
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip dangerous keys
    if (skipKeys.includes(key)) continue;
    if (typeof key === 'symbol') continue;
    
    try {
      if (value instanceof Date) {
        safeObj[key] = value.toISOString();
      } else if (typeof value === 'function') {
        // Skip functions entirely
        continue;
      } else if (typeof value === 'object' && value !== null) {
        safeObj[key] = nuclearSerialization(value);
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safeObj[key] = value;
      }
    } catch {
      // If anything fails, skip this property
      continue;
    }
  }
  
  return safeObj;
}

// Safe data fetcher
export async function safeFetchData() {
  return {
    timestamp: new Date().toISOString(),
    status: 'success',
    data: null
  };
}
