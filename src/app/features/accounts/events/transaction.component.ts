import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MessageDialogComponent } from '../../../shared/components/message-dialog.component';
import { Category } from '../../../shared/models/log-category.enum';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  standalone: true,
  imports: [CommonModule, MatOptionModule, MatSelectModule, MatDialogModule, MatInputModule, MatButtonModule],
})
export class TransactionComponent implements OnChanges {
  @Input() lineData: any;
  @Input() itemOptionsArray!: string[];
  @Input() currentIndex!: number;
  @Input() totalItems!: number;
  @Input() allTransactionsCategorized!: boolean;
  @Input() anyTransactionsCategorized!: boolean;
  @Output() save = new EventEmitter<any>();
  @Output() prevUncat = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Output() next = new EventEmitter<any>();
  @Output() nextUncat = new EventEmitter<any>();

  private messageDialog = inject(MatDialog);

  chosenCategory!: string;
  resetDisabled = true;
  instructions = 'Please select a category';
  action: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lineData'] && this.lineData) {
      this.chosenCategory = this.lineData.category || this.instructions;
    }
  }

  setAction(action: string): void {
    this.action = action;
    this.handleSave(new Event('actionSet'));
  }

  handleSave(event: Event): void {
    event.preventDefault();
    if (this.action === 'save') {
      this.save.emit({
        account: this.lineData.account,
        eventDate: this.lineData.eventDate,
        description: this.lineData.description,
        amount: this.lineData.amount,
        category: this.chosenCategory,
      });
    } else if (this.action === 'cancel') {
      if (this.anyTransactionsCategorized) {
        this.openGenericMessageDialog();
      }
    }
  }

  openGenericMessageDialog(): void {
    const messageDialogRef = this.messageDialog.open(MessageDialogComponent, {
      data: {
        heading: 'Possible Loss of Data !!',
        category: Category.Warn,
        message: 'You have already categorized some transactions.\n\nAre you sure you want to Exit?',
        buttons: ['Yes', 'No'],
      },
    });

    messageDialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        this.resetDisabled = true;
      }
    });
  }

  handlePrevUncat(event: Event): void {
    event.preventDefault();
    this.emitEvent(this.prevUncat);
  }

  handlePrevious(event: Event): void {
    event.preventDefault();
    this.emitEvent(this.previous);
  }

  handleNext(event: Event): void {
    event.preventDefault();
    this.emitEvent(this.next);
  }

  handleNextUncat(event: Event): void {
    event.preventDefault();
    this.emitEvent(this.nextUncat);
  }

  private emitEvent(emitter: EventEmitter<any>): void {
    emitter.emit({
      account: this.lineData.account,
      eventDate: this.lineData.eventDate,
      description: this.lineData.description,
      amount: this.lineData.amount,
      category: this.chosenCategory === this.instructions ? null : this.chosenCategory,
    });
  }

  onCategoryChange(event: MatSelectChange): void {
    this.chosenCategory = event.value;
    this.resetDisabled = false;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
