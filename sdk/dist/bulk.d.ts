import { BulkResult } from "./types";
export declare function analyzeBulk(addresses: string[], options?: {
    concurrency?: number;
    storeOnChain?: boolean;
    apiBase?: string;
}): Promise<BulkResult>;
