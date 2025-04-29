export interface IAccountEventDialogProps {
  currentLineData: any;
  cbSubmit: (chosenCategory: any) => void;
}

export interface IAccountEvent {
  account: string;
  eventDate: Date;
  description: string;
  amount: number;
  category: string;
//  confidence: number;
}

export interface IPaginatedAccountEvents {
  events: IAccountEvent[];
  totalEvents: number;
}
