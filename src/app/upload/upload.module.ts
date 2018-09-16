import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from './upload.component';
import {
  MatButtonModule, MatDialogModule,
  MatListModule, MatProgressBarModule,
  MatInputModule, MatSnackBarModule
} from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadService } from './upload.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatInputModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    FormsModule
  ],
  declarations: [
    UploadComponent,
    DialogComponent
  ],
  exports: [
    UploadComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [
    UploadService
  ]
})
export class UploadModule { }
