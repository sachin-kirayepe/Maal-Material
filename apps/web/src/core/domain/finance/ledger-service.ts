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
    return (
      "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    );
  }

  public recordDeal(
    buyer: string,
    amount: number,
    productId: string,
    quantity: number,
  ): LedgerTransaction {
    const tx: LedgerTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
