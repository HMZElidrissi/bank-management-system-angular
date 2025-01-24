import { Account } from './account.models';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  sourceAccount: Account;
  destinationAccount: Account;
  status: TransactionStatus;
  reference: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum TransactionType {
  CLASSIC_INTERNAL = 'CLASSIC_INTERNAL',
  CLASSIC_EXTERNAL = 'CLASSIC_EXTERNAL',
  INSTANT_INTERNAL = 'INSTANT_INTERNAL',
  INSTANT_EXTERNAL = 'INSTANT_EXTERNAL',
  STANDING_ORDER_INTERNAL = 'STANDING_ORDER_INTERNAL',
  STANDING_ORDER_EXTERNAL = 'STANDING_ORDER_EXTERNAL'
}

export enum TransactionFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export interface CreateTransactionRequest {
  amount: number;
  sourceAccountId: number;
  destinationAccountId?: number;
  description?: string;
  instant: boolean;
  external: boolean;
  recurring: boolean;
  frequency?: TransactionFrequency;
  endDate?: Date;
  totalExecutions?: number;
}

export interface TransactionSearchCriteria {
  accountId: number;
  type: TransactionType;
  status: TransactionStatus;
  startDate: Date;
  endDate: Date;
  minAmount: number;
  maxAmount: number;
  requiresApproval: boolean;
  recurring: boolean;
}

export interface TransactionApprovalRequest {
  approved: boolean;
  comment?: string;
}
