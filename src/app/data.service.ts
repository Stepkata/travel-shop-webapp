import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private http: HttpClient){
    let trips: any = [];
    let reserved: Map<any, number> = new Map();
    this.http.get<any[]>('assets/wycieczki.json').subscribe(data => {
      trips = data;
    });
    this.updateTrips(trips);
    for (const wycieczka of trips) {
      reserved.set(wycieczka, 0);
    }
    this.updateReserved(reserved);
    console.log("Data constructor!");
  }

  private reservedSubject = new BehaviorSubject<any>(null);
  reserved$ = this.reservedSubject.asObservable();

  private tripsSubject = new BehaviorSubject<any>(null);
  trips$ = this.tripsSubject.asObservable();
  
  private historySubject = new BehaviorSubject<any>(null);
  history$ = this.historySubject.asObservable();

  private boughtSubject = new BehaviorSubject<any>(null);
  bought$ = this.boughtSubject.asObservable();

  updateReserved(data: any) {
    this.reservedSubject.next(data);
  }

  updateTrips(data:any) {
    this.tripsSubject.next(data);
    console.log("update trips");
    console.log(this.tripsSubject.getValue());
  }

  updateHistory(data:any) {
    this.historySubject.next(data);
  }

  updateBought(data:any) {
    this.boughtSubject.next(data);
  }

}
