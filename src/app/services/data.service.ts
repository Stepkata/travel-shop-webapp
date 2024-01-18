import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Wycieczka } from '../structures/wycieczka.model';
import { HistoryItem } from '../structures/history-item';
import { Cart } from '../structures/cart';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Review } from '../structures/review';
import { Photo } from '../structures/photo';

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

  useFirebaseBackend: boolean = true;

  private baseUrl = "http://localhost:5000/api";

  constructor(private db: AngularFirestore, private http: HttpClient, private storage:LocalStorageService){
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

  changeBackend(firebase: boolean){
    this.useFirebaseBackend = firebase;
    if (firebase)
      this.initializeFirebase();
    else
      this.initializeAPI();

  }

  initializeAPI(){
    this.trips$ = this.getAllWycieczki();
    this.history$ = this.getHistoryItems();
    this.reviews$ = this.getAllReviews();
    this.photos$ = this.getPhotos(); 
  }

  initializeFirebase(){
    this.trips$ = this.tripsCollection.valueChanges();
    this.history$ = this.historyCollection.valueChanges();
    this.reviews$ = this.reviewsCollection.valueChanges();
    this.photos$ = this.photosCollection.valueChanges();
  }

  getHistoryItems(): Observable<any> {
    const url = `${this.baseUrl}/history`;
    return this.http.get(url);
  }

  getHistoryItemsById(userId: string): Observable<any> {
    const url = `${this.baseUrl}/history-items/${userId}`;
    return this.http.get(url);
  }

  createHistoryItem(data: any): Observable<any> {
    const url = `${this.baseUrl}/history/new`;
    return this.http.post(url, data, {responseType: 'text'});
  }

  getPhotos(): Observable<any> {
    const url = `${this.baseUrl}/photos`;
    return this.http.get(url);
  }

  createPhoto(photoData: any): Observable<any> {
    const url = `${this.baseUrl}/photos/new`;
    return this.http.post(url, photoData, {responseType: 'text'});
  }

  deletePhoto(tripId: string): Observable<any> {
    const urlWithParams = `${this.baseUrl}/photos/${tripId}`;
    return this.http.delete(urlWithParams, {responseType: 'text'});
  }

  getAllReviews(): Observable<any> {
    const url = `${this.baseUrl}/reviews`;
    return this.http.get(url);
  }

  getReviewByTripId(tripId: string): Observable<any> {
    const url = `${this.baseUrl}/reviews/${tripId}`;
    return this.http.get(url);
  }

  createReview(reviewData: any): Observable<any> {
    const url = `${this.baseUrl}/reviews`;
    return this.http.post(url, reviewData, {responseType: 'text'});
  }

  deleteReviewByFields(tripId: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}/reviews/${tripId}/${userId}`;
    return this.http.delete(url, {responseType: 'text'});
  }

  deleteAllReviewsByFields(tripId: string): Observable<any> {
    const url = `${this.baseUrl}/reviews/all/${tripId}`;
    return this.http.delete(url, {responseType: 'text'});
  }

  getAllWycieczki(): Observable<any> {
    const url = `${this.baseUrl}/wycieczki`;
    return this.http.get(url);
  }

  getWycieczkaByTripId(tripId: string): Observable<any> {
    const url = `${this.baseUrl}/wycieczki/${tripId}`;
    return this.http.get(url);
  }

  createWycieczka(wycieczkaData: any, id: string): Observable<any> {
    const url = `${this.baseUrl}/wycieczki/${id}`;
    return this.http.post(url, wycieczkaData, {responseType: 'text'});
  }

  updateWycieczka(tripId: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/wycieczki/${tripId}`;
    return this.http.put(url, updatedData, {responseType: 'text'});
  }

  updateWycieczkaPlaces(tripId: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/wycieczki/spots/${tripId}`;
    return this.http.put(url, updatedData, {responseType: 'text'});
  }
  deleteWycieczka(tripId: string): Observable<any> {
    const url = `${this.baseUrl}/wycieczki/${tripId}`;
    return this.http.delete(url, {responseType: 'text'});
  }

  addNewTrip(wycieczka:Wycieczka, zdjecia:Photo[]){
    if (this.useFirebaseBackend){
      this.tripsCollection.doc(wycieczka.Id.toString()).set({ ...wycieczka });
      for (const zdjecie of zdjecia){
        this.photosCollection.add({ ...zdjecie });
      }
    } else {
      this.createWycieczka(wycieczka, wycieczka.Id.toString()).subscribe(() => console.log("wycieczka created"));
      for (const zdjecie of zdjecia){
        this.createPhoto(zdjecie).subscribe(() => console.log("photo created"));
      }
    }
  }

  updateEntireTrip(wycieczka:Wycieczka, zdjecia:Photo[]){
    if (this.useFirebaseBackend){
      this.tripsCollection.doc(wycieczka.Id.toString()).set({ ...wycieczka });
      

      this.deleteDocumentByField("Zdjecia", "tripId", wycieczka.Id).then(() => {
        for (const zdjecie of zdjecia){
          this.photosCollection.add({ ...zdjecie });
        }
      }
      ).catch((error) => {
        console.error(error);
      });
    } else {
      this.updateWycieczka(wycieczka.Id.toString(), wycieczka).subscribe(() => console.log("wycieczka updated"));
      this.deletePhoto(wycieczka.Id.toString()).pipe(
        catchError(error => {
          console.error('Error deleting photo:', error);
          // Continue with the observable sequence by returning an empty observable
          return of(null);
        })
      )
      .subscribe(() => console.log('Photo deleted'));
      for (const zdjecie of zdjecia){
        this.createPhoto(zdjecie).subscribe(() => console.log("photo created"));
        console.log("Successfuly added!");
      }
    }
  }

  updateIloscMiejsc(_id: number, nowaIlosc: number){
    if (this.useFirebaseBackend){
      this.tripsCollection.doc(_id.toString()).update({"IloscMiejsc": nowaIlosc});
    }else{
      this.updateWycieczkaPlaces(_id.toString(), nowaIlosc).subscribe(() => console.log("update trip"));
    }
  }

  updateSerial(nextInd: number){
    this.db.collection<any>("Serial").doc("serial").update({"index": nextInd});
  }

  updateRating(_id: number){
    let ratings: Review[] = [];
    this.reviews$.subscribe((data) => {
      ratings = data.filter(item => item.tripId === _id);
      let rating = 0;
      let num = 0;
      for (const rev of ratings){
        if (rev.rating >= 0){
          rating += rev.rating;
          num++;
        }
      }
      if (num == 0)
        rating= 0;
      else
        rating = rating/num;
      this.tripsCollection.doc(_id.toString()).update({"Ocena": rating});
    });
  }

  deleteTrip(_id:number){
    if (this.useFirebaseBackend){
      this.tripsCollection.doc(_id.toString()).delete();
      this.deleteDocumentByField("Zdjecia", "tripId", _id).catch((error) => {
        console.error(error);
      });
      this.deleteDocumentByField("Recenzje", "tripId", _id).catch((error) => {
        console.error(error);
      }); 
    } else {
      this.deleteWycieczka(_id.toString()).subscribe(() => console.log("delete trip"));
      this.deletePhoto(_id.toString()).subscribe(() => console.log("delete trip"));
      this.deleteAllReviewsByFields(_id.toString()).subscribe(() => console.log("delete trip"));
    }

  }


  deleteDocumentByField(collectionName: string, fieldName: string, value: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db
        .collection(collectionName, (ref) => ref.where(fieldName, '==', value))
        .get()
        .subscribe((querySnapshot) => {
          if (querySnapshot.size == 0)
            resolve();
          else{
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
          }
          
        });
    });
  }

  addReview(review: Review){
    if (this.useFirebaseBackend)
      this.reviewsCollection.add({...review});
    else
      this.createReview(review).subscribe(() => console.log("reate review"));
  }

  deleteReview(tripId: number, userId: string){
    if (this.useFirebaseBackend){
      this.deleteDocumentByFields("Recenzje", "tripId", tripId, "userId", userId).catch((error) => {
        console.error(error);
      }); 
      this.updateRating(tripId);
    }else {
      this.deleteReviewByFields(tripId.toString(), userId).subscribe(() => console.log("delete trip"));
    }
  }

  deleteDocumentByFields(collectionName: string, field1Name: string, value1: any, field2Name: string, value2: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db
        .collection(collectionName, (ref) => {
          return ref.where(field1Name, '==', value1).where(field2Name, '==', value2);
        })
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

  addHistory(history: HistoryItem){
    if (this.useFirebaseBackend){
      this.historyCollection.add({...history})
    } else {
      this.createHistoryItem(history).subscribe(() => console.log("reate review"));
    }
  }

  updateCart(data:Cart){
    this.cartSubject.next(data);
  }

  updateRate(data:number){
    this.rateSubject.next(data);
  }
}
