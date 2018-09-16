import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { UploadService } from '../upload.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('file') file;
  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  keywords: string;
  waitingForResponse = false;
  readyToLoad = false;

  public files: Set<File> = new Set();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public uploadService: UploadService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { }

  onFilesAdded() {
    this.readyToLoad = true;
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      this.readyToLoad = false;
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    console.log(this.files)
    this.progress = this.uploadService.upload(this.files, this.keywords);
    if (!this.progress) {
      this.showError('Incorrect File type. Please convert to .txt');
    }
    // console.log(this.progress);
    for (const key in this.progress) {
      if (this.progress.hasOwnProperty(key)) {
        this.progress[key].progress.subscribe(val => {
          // console.log(val)
          if (!val && val != 0) {
            this.showError('Upload Failed, Please Retry');
          }
        });
      }
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (const key in this.progress) {
      if (this.progress.hasOwnProperty(key)) {
        allProgressObservables.push(this.progress[key].progress);
      }
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
      this.dialogRef.close();
    });
  }

  showError(message) {
    this.readyToLoad = false;
    this.canBeClosed = true;
    this.dialogRef.disableClose = false;

    // ... the upload was successful...
    this.uploadSuccessful = true;

    // ... and the component is no longer uploading
    this.uploading = false;
    this.dialogRef.close();
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }
}
