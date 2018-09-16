import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UploadService {
  constructor(private http: HttpClient, public snackBar: MatSnackBar, private router: Router) {}
  url;

  public upload(files: Set<File>, keyword): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};

    files.forEach(file => {
      if (!file.name.endsWith('.txt')) {
        return;
      }
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('keywordString', keyword);
      // create a http-post request and pass the form
      // tell it to report the upload progress
      this.url = this.router.url;
      const req = new HttpRequest('POST', this.url, formData, {
        reportProgress: true,
        responseType: 'text'
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();

      console.log(req)

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          this.downloadFile(event.body);
          progress.complete();
        } else if (event instanceof HttpErrorResponse) {
          console.log(event.error);
          progress.complete();
        }
      }, (error => {
        console.log(error);
        progress.complete();
        this.snackBar.open('Error Occurred Please Try Again', '', {
          duration: 3000,
        });
      }));

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

  downloadFile(data) {
    this.url = this.router.url;
    const blob = new Blob([data], { type: 'text/plain' });
    const fileLocation = window.URL.createObjectURL(blob);
    const pwa = window.open(fileLocation);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
}
