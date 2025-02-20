import type { TRANSACTION_TYPE } from "@/enums";

export interface TransactionDTO {
  _id?: string;
  title: string;
  type: TRANSACTION_TYPE;
  amount: number;
  category: string;
  date: string;
}

export interface Transaction {
  id?: string;
  title: string;
  type: TRANSACTION_TYPE;
  amount: number;
  category: string;
  date: string;
}

export function getTransactionFromDto(dto: TransactionDTO): Transaction {
  return {
    id: dto._id,
    title: dto.title,
    type: dto.type,
    amount: dto.amount,
    category: dto.category,
    date: dto.date,
  };
}

export function getDtoFromTransaction(transaction: Transaction): TransactionDTO {
  return {
    title: transaction.title,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date,
  };
}
