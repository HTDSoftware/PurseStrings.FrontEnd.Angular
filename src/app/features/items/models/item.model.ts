export interface Item {
  itemName: string;
  categoryName: string;
  budgetPeriod: string;
  budgetValue: number;
  lastDueDate: Date;
  nextDueDate: Date;
  taxDeductable: boolean;
  includeInBudget: boolean;
  trackItem: boolean;
  payByMethod: string;
  payFromAccount: string;
  billerCode: number;
  billerName: string;
  billerReference: string;
  billerDescription: string;
  effectiveStartDate: Date;
  effectiveEndDate: Date;
  medicareRebate: number;
}

export interface ItemDTO {
  itemName: string;
  categoryName: string;
  budgetPeriod: string;
  budgetValue: number;
  lastDueDate: Date;
  nextDueDate: Date;
  includeInBudget: boolean;
  effectiveStartDate: Date;
  effectiveEndDate: Date;
}

export interface PaginatedItems {
  items: ItemDTO[];
  total: number;
}
