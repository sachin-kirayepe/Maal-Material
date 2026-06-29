import { usePredictiveStore } from "../../../store/predictive-state";

export interface LedgerTransaction {
  id: string;
  type: "DEAL_NEGOTIATED" | "FUNDS_TRANSFERRED" | "ASSET_DEPLOYED";
  amount: number;
  currency: string;
  timestamp: string;
  parties: {
    buyer: string;
    seller: string;
  };
  metadata: Record<string, any>;
  cryptoHash: string; // Simulated immutable hash
}

class LedgerService {
  private transactions: LedgerTransaction[] = [];

  private generateHash(): string {
    // Simulated SHA-256 for demo purposes
    return "0x" + Date.now().toString(16) + "hash";
  }

  public recordDeal(
    buyer: string,
    amount: number,
    productId: string,
    quantity: number,
  ): LedgerTransaction {
    const tx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      type: "DEAL_NEGOTIATED",
      amount,
      currency: "USD",
      timestamp: new Date().toISOString(),
      parties: {
        buyer,
        seller: "Maal-Material_Corp",
      },
      metadata: {
        productId,
        quantity,
        aiNegotiated: true,
      },
      cryptoHash: "",
    };

    tx.cryptoHash = this.generateHash();
    this.transactions.push(tx);

    // Trigger global economic spike in the predictive matrix
    usePredictiveStore.getState().injectLiveRevenueSpike(amount);

    console.log(`[LEDGER] Immutable Deal Recorded: ${tx.id} | Hash: ${tx.cryptoHash}`);
    return tx;
  }

  public getTransactions(): LedgerTransaction[] {
    return [...this.transactions];
  }
}

export const ledgerService = new LedgerService();
