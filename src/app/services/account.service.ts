import { Injectable } from '@angular/core';
import { User } from '../structures/user';
import { BehaviorSubject, Observable} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private activeUserSubject = new BehaviorSubject<User | null>(null);
  public activeUser$: Observable<any> | null = this.activeUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  public isLoggedIn = false;
  public all_users$: Observable<User[]>;
  userCollection: any;
  constructor(private db: AngularFirestore, private router: Router) { 
    this.userCollection = this.db.collection<User>('Users');
    this.all_users$ = this.userCollection.valueChanges();
  }

  logIn(credentials: any){
    this.isLoggedIn = true;
    this.isLoggedInSubject.next(true);
    console.log("Logged In!");
    console.log(this.checkLogin());
    this.router.navigate(['']);
    this.getUser(credentials.user.uid).then((result: User) => {
      this.activeUserSubject.next(result);
      console.log("CREDENTIALS!");
    }).catch((error: any) => {
      // Handle the error here
    });
  }

  logOut(){
    this.activeUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.isLoggedIn = false;
  }

  checkLogin(){
    return this.isLoggedIn;
  }

  getUser(uid: string){
    const docRef = this.userCollection.doc(uid);
    return docRef.get().then((docSnapshot: { exists: any; data: () => any; }) => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        console.log('Document data:', data);
        return data;
      } else {
        console.log('Document does not exist.');
        return null;
      }
    }).catch((error: any) => {
      console.error('Error getting document:', error);
      throw error;
    });
  }

  createUser(user: User){
    this.userCollection.doc(user.Uid).set({...user});
  }

  deleteUser(user: User){
    this.userCollection.doc(user.Uid).delete();
  }

  changeRole(user: User, role:string){
    this.userCollection.doc(user.Uid).update({"Rola": role});
  }

  ban(user: User){
    this.userCollection.doc(user.Uid).update({"Ban": true});
  }
}
