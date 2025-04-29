import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggingService } from '../../core/services/logging.service';
import { FileContentService } from '../../core/services/file-content.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule],
})
export class FileUploadComponent {
  @Output() fileLoaded = new EventEmitter<void>();

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  lineCount: number | null = null;
  errorMessage: string | null = null;
  action: string = '';

  constructor(
    private fb: FormBuilder,
    private fileContentService: FileContentService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    private logger: LoggingService
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
    });

    this.dialogRef.disableClose = true;
  }

  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.uploadForm.patchValue({ file: file });

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        const lines = fileContent.split('\n');
        this.lineCount = lines.length;
        this.fileContentService.setFileContent(fileContent);
      };
      reader.readAsText(file);

      this.errorMessage = null;
    }
  }

  setAction(action: string): void {
    this.action = action;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.action === 'load') {
      this.loadFile();
    } else if (this.action === 'cancel') {
      this.cancel();
    }
  }

  loadFile(): void {
    if (this.selectedFile) {
      this.logger.sendLog({
        level: 'INF',
        component: 'file-upload.component.ts',
        message: 'Loading file: ' + this.selectedFile.name
      });

      this.snackBar.open('File loaded successfully', 'Close', { duration: 3000 });
      this.fileLoaded.emit();
      this.dialogRef.close();
    } else {
      this.errorMessage = 'Please select a file from the "Chosen File" dropdown';
    }
  }

  cancel(): void {
    this.logger.sendLog({
      level: 'INF',
      component: 'file-upload.component.ts',
      message: 'Cancel action triggered'
    });

    this.selectedFile = null;
    this.lineCount = null;
    this.errorMessage = null;
    this.dialogRef.close();
  }
}
