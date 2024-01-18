import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // private eventSource: EventSource;

  constructor(private ngZone: NgZone,
    private eventSource: EventSource) {}

  connect(): Observable<string> {
    return new Observable<string>((observer) => {
      this.eventSource = new EventSource('http://localhost:5000/chat');

      this.eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          observer.next(event.data);
        });
      };

      this.eventSource.onerror = (error) => {
        this.ngZone.run(() => {
          observer.error(error);
        });
      };

      return () => {
        this.eventSource.close();
      };
    });
  }
}