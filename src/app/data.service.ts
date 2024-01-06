import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Wycieczka } from './structures/wycieczka.model';
import { HistoryItem } from './structures/history-item';
import { Cart } from './structures/cart';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private http: HttpClient){
    let trips: Wycieczka[] = [];
    let reserved: Map<any, number> = new Map();
    let bought: Map<any, number> = new Map();

    let cart: Cart = new Cart();
    this.updateCart(cart);

    this.http.get<Wycieczka[]>('assets/wycieczki.json').subscribe(data => {
      trips = data.map((wycieczka, index) => ({
        ...wycieczka,
        Id: index + 1,
        Rating: [],
      }));
    });
    this.updateTrips(trips);

    for (const wycieczka of trips) {
      bought.set(wycieczka, 0);
    }
    this.updateBought(bought);
    console.log("Data constructor!");
  }


  private tripsSubject = new BehaviorSubject<any>(null);
  trips$ = this.tripsSubject.asObservable();
  
  private historySubject = new BehaviorSubject<any>(null);
  history$ = this.historySubject.asObservable();

  private boughtSubject = new BehaviorSubject<any>(null);
  bought$ = this.boughtSubject.asObservable();

  private cartSubject = new BehaviorSubject<any>(null);
  cart$ = this.cartSubject.asObservable();

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

  updateCart(data:Cart){
    this.cartSubject.next(data);
  }

}
