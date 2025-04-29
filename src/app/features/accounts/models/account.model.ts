export interface IAccountShort {
  accountName: string;
  bankName: string;
  bsb: string;
  accountNumber: string;
  calculatedBalance: number;
  lastEventDate: Date;
  onlineBankingNickname: string;
  onlineBankingBalance: number;
  onlineBankingAvailableBalance: number;
  showAccountInSummary: boolean;
  typeOfBalance: BalanceType;
}

export interface IAccount {
  accountName: string;
  bankName: string;
  currency: string;
  bsb: string;
  accountNumber: string;
  calculatedBalance: number;
  lastEventDate: Date;
  interestRate: number;
  interestPeriod: string;
  creditAccount: boolean;
  onlineBankingUrl: string;
  onlineBankingUsername: string;
  onlineBankingPassword: any[];
  onlineBankingNickname: string;
  onlineBankingBalance: number;
  onlineBankingAvailableBalance: number;
  showAccountInSummary: boolean;
  onlineBankingEventDecodeMethod: string;
  typeOfBalance: BalanceType;
}

export enum BalanceType {
  Debit = 'Debit',
  Credit = 'Credit',
}
