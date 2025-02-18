import type { TRANSACTION_TYPE } from "@/enums";

export interface Transaction {
  id?: string;
  title: string;
  type: TRANSACTION_TYPE;
  amount: number;
}