"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBulk = analyzeBulk;
const analyze_1 = require("./analyze");
async function analyzeBulk(addresses, options) {
    const concurrency = options?.concurrency ?? 3;
    const results = [];
    for (let i = 0; i < addresses.length; i += concurrency) {
        const batch = addresses.slice(i, i + concurrency);
        const batchResults = await Promise.all(batch.map((address) => (0, analyze_1.analyzeWallet)(address, {
            storeOnChain: options?.storeOnChain ?? false,
            apiBase: options?.apiBase
        })));
        results.push(...batchResults);
    }
    return {
        results,
        summary: {
            total: results.length,
            low: results.filter((result) => result.label === "LOW").length,
            medium: results.filter((result) => result.label === "MEDIUM").length,
            high: results.filter((result) => result.label === "HIGH").length,
            critical: results.filter((result) => result.label === "CRITICAL").length
        }
    };
}
