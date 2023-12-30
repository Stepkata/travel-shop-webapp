import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private reservedSubject = new BehaviorSubject<any>(null);
  reserved$ = this.reservedSubject.asObservable();

  private tripsSubject = new BehaviorSubject<any>(null);
  trips$ = this.reservedSubject.asObservable();

  updateReserved(data: any) {
    this.reservedSubject.next(data);
  }

  updateTrips(data:any) {
    this.tripsSubject.next(data);
  }

}
