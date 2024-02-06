import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 1000,
  maxSize: 25000000, //25mil Bytes -> 25MB
  sizeCalculation: (value, key) => {
    return Buffer.byteLength(JSON.stringify(value) + key);
  }
});

export default cache;