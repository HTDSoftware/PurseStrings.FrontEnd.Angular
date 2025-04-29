import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { AccountEventService } from '../services/account-event.service';
import { FileContentService } from '../../../core/services/file-content.service';
import { ItemService } from '../../items/services/item.service';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-account-event',
  templateUrl: './account-event.component.html',
  standalone: true,
  imports: [CommonModule, TransactionComponent],
})
export class AccountEventComponent implements OnInit {
  private accountEventService = inject(AccountEventService);
  private fileContentService = inject(FileContentService);
  private itemService = inject(ItemService);
  private logger = inject(LoggingService);

  fileContent: string | null = null;
  lines: string[] = [];
  currentLineIndex = 0;
  loading = true;

  columnIndices: { [key: string]: number } = {};
  allLinesNoHeader: any[] = [];
  currentLineData: any = null;
  itemOptionsArray: any[] = [];

  ngOnInit(): void {
    this.fileContent = this.fileContentService.getFileContent();
    if (this.fileContent) {
      this.lines = this.fileContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      this.parseHeader(this.lines[0]);
      this.currentLineIndex = 1;
      this.loadAllLines();
      this.loadCurrentLine();
    }
    this.loading = false;
  }

  private parseHeader(headerLine: string): void {
    const headers = headerLine.split(',').map((header) => header.trim());
    const fields = ['Transaction Date', 'Details', 'Account', 'Debit', 'Credit', 'Original Description'];
    fields.forEach((field) => {
      const index = headers.indexOf(field);
      if (index !== -1) {
        this.columnIndices[field] = index;
      }
    });
  }

  private loadAllLines(): void {
    for (let i = 1; i < this.lines.length; i++) {
      this.allLinesNoHeader[i - 1] = this.parseLine(this.lines[i]);
      this.allLinesNoHeader[i - 1].category = null;
    }
  }

  private loadCurrentLine(): void {
    this.currentLineData = this.allLinesNoHeader[this.currentLineIndex - 1];
    this.populateItemOptionsArray(this.currentLineData.eventDate);
  }

  private parseLine(line: string): any {
    const columns = line.split(',').map((column) => column.trim().replace(/"/g, ''));
    const debit = columns[this.columnIndices['Debit']];
    const credit = columns[this.columnIndices['Credit']];
    const amount = this.isNumeric(debit) ? parseFloat(debit) : this.isNumeric(credit) ? parseFloat(credit) : 0;
    return {
      account: columns[this.columnIndices['Account']],
      eventDate: new Date(columns[this.columnIndices['Transaction Date']]),
      description: columns[this.columnIndices['Details']],
      amount: amount,
      category: '',
      confidence: 90,
    };
  }

  private isNumeric(value: string): boolean {
    return /^\d+(\.\d+)?$/.test(value);
  }

  handleSave(formData: any): void {
    this.accountEventService
      .createAccountEvent(
        formData.account,
        formData.eventDate,
        formData.description,
        formData.amount,
        formData.category
      )
      .subscribe({
        next: (returnCode) => {
          if (returnCode === 201) {
            alert('Account Event created successfully');
            this.currentLineIndex++;
            this.loadCurrentLine();
          } else {
            alert('Error saving account event');
          }
        },
        error: (err) => {
          this.logger.sendLog({
            level: 'ERR',
            component: 'account-event.component',
            message: 'Error while creating Account Event:' + err
          });
        },
        complete: () => {
          this.logger.sendLog({
            level: 'INF',
            component: 'account-event.component',
            message: 'Account Event creation process completed'
          });
        },
      });
  }

  handlePrevUncat(formData: any): void {
    this.allLinesNoHeader[this.currentLineIndex - 1] = formData;
    const originalIndex = this.currentLineIndex;

    while (this.currentLineIndex > 1) {
      this.currentLineIndex--;
      if (!this.allLinesNoHeader[this.currentLineIndex - 1].category) {
        this.loadCurrentLine();
        return;
      }
    }

    this.currentLineIndex = originalIndex;
    this.loadCurrentLine();
  }

  handlePrevious(formData: any): void {
    if (this.currentLineIndex > 1) {
      this.allLinesNoHeader[this.currentLineIndex - 1] = formData;
      this.currentLineIndex--;
      this.loadCurrentLine();
    }
  }

  handleNext(formData: any): void {
    if (this.currentLineIndex < this.allLinesNoHeader.length) {
      this.allLinesNoHeader[this.currentLineIndex - 1] = formData;
      this.currentLineIndex++;
      this.loadCurrentLine();
    }
  }

  handleNextUncat(formData: any): void {
    this.allLinesNoHeader[this.currentLineIndex - 1] = formData;
    const originalIndex = this.currentLineIndex;

    while (this.currentLineIndex < this.allLinesNoHeader.length) {
      this.currentLineIndex++;
      if (!this.allLinesNoHeader[this.currentLineIndex - 1].category) {
        this.loadCurrentLine();
        return;
      }
    }

    this.currentLineIndex = originalIndex;
    this.loadCurrentLine();
  }

  allTransactionsCategorized(): boolean {
    return this.allLinesNoHeader.every((transaction: any) => transaction.category);
  }

  anyTransactionsCategorized(): boolean {
    return this.allLinesNoHeader.some((transaction: any) => transaction.category);
  }

  private populateItemOptionsArray(transactionDate: string): void {
    const newDate: Date = new Date(transactionDate);

    this.itemService.getAllDTOAsOfDate(newDate).subscribe({
      next: (items) => {
        this.itemOptionsArray = items.map((item) => item.categoryName);
      },
      error: (err) => {
        this.logger.sendLog({
          level: 'ERR',
          component: 'account-event.component',
          message: 'Error fetching items:' + err
        });
        alert('Error: Items could not be populated');
      },
      complete: () => {
        this.logger.sendLog({
          level: 'INF',
          component: 'account-event.component',
          message: 'Items fetched successfully'
        });
      },
    });
  }
}
