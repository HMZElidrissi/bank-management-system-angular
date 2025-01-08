export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export interface Account {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  balance: number;
  status: AccountStatus;
}

export interface CreateAccountRequest {
  userId: number;
  initialBalance: number;
}

export interface UpdateAccountRequest {
  amount: number;
  status: AccountStatus;
}
