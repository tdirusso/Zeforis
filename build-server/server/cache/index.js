"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = require("lru-cache");
const cache = new lru_cache_1.LRUCache({
    max: 1000,
    maxSize: 25000000,
    sizeCalculation: (value, key) => {
        return Buffer.byteLength(JSON.stringify(value) + key);
    }
});
exports.default = cache;
