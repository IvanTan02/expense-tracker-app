import type { TRANSACTION_TYPE } from "@/enums";

export interface TransactionDTO {
  _id?: string;
  title: string;
  type: TRANSACTION_TYPE;
  amount: number;
}

export interface Transaction {
  id?: string;
  title: string;
  type: TRANSACTION_TYPE;
  amount: number;
}

export function getTransactionFromDto(dto: TransactionDTO): Transaction {
  return {
    id: dto._id,
    title: dto.title,
    type: dto.type,
    amount: dto.amount,
  };
}

export function getDtoFromTransaction(transaction: Transaction): TransactionDTO {
  return {
    title: transaction.title,
    type: transaction.type,
    amount: transaction.amount,
  };
}