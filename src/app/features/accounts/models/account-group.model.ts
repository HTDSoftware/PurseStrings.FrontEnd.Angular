import { IAccount } from "./account.model";

export interface IGroupedAccountDTO {
  accountsInCredit: IAccount[];
  accountsInCreditSubtotals: IGroupedTotals;
  accountsInDebit: IAccount[];
  accountsInDebitSubtotals: IGroupedTotals;
  grandTotals: IGroupedTotals;
}

export interface IGroupedTotals {
  calculatedBalance: number;
  onlineBankingBalance: number;
  onlineBankingAvailableBalance: number;
}
