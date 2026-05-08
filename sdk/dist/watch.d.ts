import { WatchEvent } from "./types";
export declare function watchWallet(address: string, onEvent: (event: WatchEvent) => void, options?: {
    intervalMs?: number;
    apiBase?: string;
}): () => void;
