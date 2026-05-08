import { WalletVerdict } from "./types";
export declare function analyzeWallet(address: string, options?: {
    storeOnChain?: boolean;
    apiBase?: string;
}): Promise<WalletVerdict>;
