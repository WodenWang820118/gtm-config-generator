import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgIf } from '@angular/common';
import { EditorService } from '../../services/editor/editor.service';
import { BehaviorSubject, tap } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EventBusService } from '../../../../services/event-bus/event-bus.service';

@Component({
  selector: 'app-file-upload-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatSidenavModule,
  ],
  template: `<div class="file-upload-dialog">
    <mat-dialog-content class="file-upload-dialog__actions">
      <div class="file-upload-dialog__actions__action">
        <button type="button" mat-button (click)="fileInput.click()">
          <mat-icon>cloud_upload</mat-icon>
          Upload JSON File
        </button>
        <input
          hidden
          (change)="onFileSelected($event)"
          #fileInput
          type="file"
        />
      </div>
      <div class="file-upload-dialog__actions__action">
        <button type="button" mat-button (click)="fileInput.click()">
          <mat-icon>cloud_upload</mat-icon>
          Upload XLSX File
        </button>
        <input
          hidden
          (change)="onFileSelected($event)"
          #fileInput
          type="file"
        />
      </div>
    </mat-dialog-content>
  </div>`,
  styles: [
    `
      .file-upload-dialog {
        &__actions {
          .mat-icon {
            transform: scale(1.5);
          }
          width: 100%;
          margin: auto;

          &__action {
            button {
              margin-right: 1rem;
            }
          }

          &__action:not(:last-child) {
            margin-bottom: 1rem;
          }
        }
      }
    `,
  ],
})
export class FileUploadDialogComponent {
  constructor(
    public dialog: MatDialog,
    private editorService: EditorService,
    private eventBusService: EventBusService
  ) {}

  selectedFile: File | null = null;
  fileContent = new BehaviorSubject<any>(null);

  handFileToSidenavForm(file: File) {
    this.dialog.closeAll();
    this.eventBusService.emit('toggleDrawer', file);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const fileExtension = file.name.split('.').pop();
      const fileType = file.type;

      if (fileExtension === 'json' && fileType === 'application/json') {
        this.selectedFile = file;
        this.handleJsonFile(file);
      } else if (
        fileExtension === 'xlsx' &&
        fileType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.selectedFile = file;
        this.handFileToSidenavForm(file);
      } else {
        this.selectedFile = null;
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: 'Please upload a valid JSON file.',
          },
        });
      }
    }
  }

  handleJsonFile(file: File): void {
    this.readJsonFileContent(file);
    this.handleJsonFileContent();
  }

  readJsonFileContent(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const fileContentString = e.target.result;

      try {
        // update the file content
        this.fileContent.next(JSON.parse(fileContentString));
      } catch (error) {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: 'Error parsing JSON file. Please try again.',
          },
        });
      }
    };

    reader.onerror = () => {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: 'Error reading file. Please try again.',
        },
      });
    };

    reader.readAsText(file);
  }

  handleJsonFileContent() {
    // handle the file content after it has been read
    this.fileContent
      .pipe(
        tap((data) => {
          if (data !== null || data !== undefined) {
            this.editorService.setContent(
              'inputJson',
              JSON.stringify(data, null, 2)
            );
            this.dialog.closeAll();
          }
        })
      )
      .subscribe();
  }
}