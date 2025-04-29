import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  heading: string;
  category: 'Error' | 'Warn' | 'Info';
  message: string;
  buttons: string[];
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
})
export class MessageDialogComponent {
  heading: string;
  category: 'Error' | 'Warn' | 'Info';
  message: string;
  buttons: string[];

  constructor(
    private dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.heading = data.heading;
    this.category = data.category;
    this.message = data.message;
    this.buttons = data.buttons;
    this.dialogRef.disableClose = true;
  }

  onButtonClick(button: string): void {
    this.dialogRef.close(button);
  }
}
