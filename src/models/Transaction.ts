import type { TRANSACTION_TYPE } from "@/enums";
import { DateTime } from "luxon";

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
    date: DateTime.fromISO(dto.date).toFormat('yyyy-MM-dd'),
  };
}

export function getDtoFromTransaction(transaction: Transaction): TransactionDTO {
  return {
    _id: transaction.id,
    title: transaction.title,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date,
  };
}
