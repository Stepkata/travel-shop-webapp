import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Wycieczka } from './structures/wycieczka.model';
import { HistoryItem } from './structures/history-item';
import { Cart } from './structures/cart';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Review } from './structures/review';
import { Photo } from './structures/photo';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  trips$: Observable<Wycieczka[]>;
  history$: Observable<HistoryItem[]>;
  reviews$: Observable<Review[]>;
  photos$: Observable<Photo[]>;

  tripsCollection: any;
  historyCollection:any;
  reviewsCollection:any;
  photosCollection:any;

  private boughtSubject = new BehaviorSubject<any>(null);
  bought$ = this.boughtSubject.asObservable();

  private cartSubject = new BehaviorSubject<any>(null);
  cart$ = this.cartSubject.asObservable();


  constructor(private http: HttpClient, private db: AngularFirestore){
    let cart: Cart = new Cart();
    this.updateCart(cart);

    this.tripsCollection = this.db.collection<Photo>('Zdjecia');
    this.historyCollection = this.db.collection<HistoryItem>('Historia');
    this.reviewsCollection = this.db.collection<Review>('Recenzje');
    this.photosCollection = this.db.collection<Wycieczka>('Wycieczka');

    this.photos$ = this.tripsCollection.valueChanges();
    this.history$ = this.historyCollection.valueChanges();
    this.reviews$ = this.reviewsCollection.valueChanges();
    this.trips$ = this.photosCollection.valueChanges();  

    console.log("Data constructor!");
  }

  addNewTrip(wycieczka:Wycieczka, zdjecia:Photo[]){
    this.tripsCollection.add({ ...wycieczka });
    for (const zdjecie of zdjecia){
      this.photosCollection.add({ ...zdjecie });
    }
  }

  updateIloscMiejsc(_id: number, nowaIlosc: number){
    this.tripsCollection.doc(_id).update({"IloscMiejsc": nowaIlosc});
  }

  deleteTrip(_id:number){
    this.tripsCollection.doc(_id).delete();
  }

  addReview(review: Review){
    this.reviewsCollection.add({...review});
  }

  addHistory(history: HistoryItem){
    this.historyCollection.add({...history})
  }

  
  updateCart(data:Cart){
    this.cartSubject.next(data);
  }

}
