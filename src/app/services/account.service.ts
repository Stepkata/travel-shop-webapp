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
  public activeUser$: Observable<User | null> = this.activeUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private isLoggedIn = false;
  private isManager = false;
  private isAdmin = false;
  private isBanned = false;
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
    this.all_users$.subscribe((data) => {
      let user: User| any = null;
      if (data != null){
        user = data.find(item => item.Uid == credentials.user.uid);
        if (user){
          this.activeUserSubject.next(user);
          this.isAdmin = user.isAdmin;
          this.isManager = user.isManager;
          this.isBanned = user.isBanned;
      }
      }
    })
  }

  logOut(){
    this.activeUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isManager = false;
    console.log("Logged out!");
  }

  checkLogin(){
    return this.isLoggedIn;
  }

  checkManager(){
    return this.isManager;
  }

  checkAdmin(){
    return this.isAdmin;
  }

  checkBanned(){
    return this.isBanned;
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
    this.ban(user.Uid, isBanned);
  }

  ban(_id: string, isBanned: boolean = true){
    this.userCollection.doc(_id).update({"Ban": isBanned});
  }
}
