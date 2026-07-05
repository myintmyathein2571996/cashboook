export type TransactionType = 'income' | 'expense';

export type DebtEntryType = 'borrowed' | 'lent' | 'repaid_to' | 'repaid_by';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
  created_at: number;
}

export interface Person {
  id: number;
  name: string;
  note: string;
  created_at: number;
}

export interface DebtEntry {
  id: number;
  person_id: number;
  type: DebtEntryType;
  amount: number;
  note: string;
  date: string;
  created_at: number;
}

export interface PersonWithBalance extends Person {
  balance: number;
}

export interface DebtEntryWithPerson extends DebtEntry {
  person_name: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  monthNet: number;
  totalYouOwe: number;
  totalOwedToYou: number;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}
