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
    let bought: Map<any, number> = new Map();
    let reviews: Map<number, string[]> = new Map();

    let cart: Cart = new Cart();
    this.updateCart(cart);

    let photos: any;
    this.http.get<any>('assets/photos.json').subscribe(data => {
      photos = data;
    });

    this.http.get<Wycieczka[]>('assets/wycieczki.json').subscribe(data => {
      trips = data.map((wycieczka, index) => ({
        ...wycieczka,
        Id: index + 1,
        DodatkoweZdjecia: photos!.find((item: { Id: number; Photos: []}) => item.Id === index+1)!.Photos || [],
        Rating: [],
      }));
    });
    this.updateTrips(trips);

    for (const wycieczka of trips) {
      bought.set(wycieczka, 0);
      reviews.set(wycieczka.Id, []);
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

  private reviewSubject = new BehaviorSubject<any>(null);
  review$ = this.reviewSubject.asObservable();

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

  updateReviews(data:any){
    this.reviewSubject.next(data);
  }

}
