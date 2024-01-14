import { Injectable } from '@angular/core';
import { User } from '../structures/user';
import { BehaviorSubject, Observable} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private activeUserSubject = new BehaviorSubject<string>("");
  public activeUser$: Observable<string> = this.activeUserSubject.asObservable();
  private activeUserNameSubject = new BehaviorSubject<string>("");
  public activeUserName$: Observable<string> = this.activeUserNameSubject.asObservable();
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
    this.router.navigate(['']);
    this.activeUserSubject.next(credentials.user.uid);
    let username: string = ""
    this.all_users$.subscribe((data) => {
      let user: User| any = null;
      if (data != null){
        user = data.find(item => item.Uid == credentials.user.uid);
        if (user){
          username = user.Imie;
          this.activeUserNameSubject.next(username);
      }
      }
    })
  }

  logOut(){
    this.activeUserSubject.next("");
    this.isLoggedInSubject.next(false);
    this.isLoggedIn = false;
  }

  checkLogin(){
    return this.isLoggedIn;
  }

  createUser(user: User){
    this.userCollection.doc(user.Uid).set({...user});
  }

  deleteUser(user: User){
    this.userCollection.doc(user.Uid).delete();
  }

  changeAdmin(user: User, isAdmin: boolean){
    this.userCollection.doc(user.Uid).update({"isAdmin": isAdmin});
  }

  changeManager(user: User, isManager: boolean){
    this.userCollection.doc(user.Uid).update({"isManager": isManager});
  }

  changeBan(user: User, isBanned: boolean){
    this.userCollection.doc(user.Uid).update({"Ban": isBanned});
  }

  ban(_id: string){
    this.userCollection.doc(_id).update({"Ban": true});
  }
}
