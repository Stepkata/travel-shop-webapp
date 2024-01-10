import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  serial$: Observable<any[]>;

  tripsCollection: any;
  historyCollection:any;
  reviewsCollection:any;
  photosCollection:any;

  private cartSubject = new BehaviorSubject<any>(null);
  cart$ = this.cartSubject.asObservable();

  private rateSubject = new BehaviorSubject<any>(null);
  rate$ = this.rateSubject.asObservable();


  constructor(private db: AngularFirestore){
    let cart: Cart = new Cart();
    this.updateCart(cart);
    this.updateRate(1);

    this.tripsCollection = this.db.collection<Wycieczka>('Wycieczka');
    this.historyCollection = this.db.collection<HistoryItem>('Historia');
    this.reviewsCollection = this.db.collection<Review>('Recenzje');
    this.photosCollection = this.db.collection<Photo>('Zdjecia');

    this.trips$ = this.tripsCollection.valueChanges();
    this.history$ = this.historyCollection.valueChanges();
    this.reviews$ = this.reviewsCollection.valueChanges();
    this.photos$ = this.photosCollection.valueChanges(); 

    this.serial$ = this.db.collection<any>("Serial").doc("serial").valueChanges()

    console.log("Data constructor!");
  }

  addNewTrip(wycieczka:Wycieczka, zdjecia:Photo[]){
    this.tripsCollection.doc(wycieczka.Id.toString()).set({ ...wycieczka });
    for (const zdjecie of zdjecia){
      this.photosCollection.add({ ...zdjecie });
    }
  }

  updateIloscMiejsc(_id: number, nowaIlosc: number){
    this.tripsCollection.doc(_id.toString()).update({"IloscMiejsc": nowaIlosc});
  }

  updateSerial(nextInd: number){
    this.db.collection<any>("Serial").doc("serial").update({"index": nextInd});
  }

  updateRating(_id: number){
    let ratings: Review[] = [];
    this.reviews$.subscribe((data) => {
      ratings = data.filter(item => item.tripId === _id);
      let rating = 0;
      for (const rev of ratings){
        rating += rev.rating;
      }
      rating = rating/ratings.length;
      this.tripsCollection.doc(_id.toString()).update({"Ocena": rating});
    });
  }

  deleteTrip(_id:number){
    this.tripsCollection.doc(_id.toString()).delete();
    this.deleteDocumentByField("Zdjecia", "tripId", _id).catch((error) => {
      console.error(error);
    });
    this.deleteDocumentByField("Recenzje", "tripId", _id).catch((error) => {
      console.error(error);
    }); 
  }

  deleteDocumentByField(collectionName: string, fieldName: string, value: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db
        .collection(collectionName, (ref) => ref.where(fieldName, '==', value))
        .get()
        .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.db
              .collection(collectionName)
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log('Document successfully deleted!');
                resolve();
              })
              .catch((error) => {
                console.error('Error deleting document: ', error);
                reject(error);
              });
          });
        });
    });
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

  updateRate(data:number){
    this.rateSubject.next(data);
  }
}
