import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { User } from '../../structures/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit{
  users: User[] = [];
  isLoading:boolean =  true;

  constructor (private AccountService: AccountService){}

  ngOnInit(): void {
    console.log("Users!");
    this.AccountService.all_users$.subscribe((data) =>{
      if (data!= null)
        this.users = data;
      this.isLoading = false;
    })
  }

  toggleAdmin(user: User, isAdmin: boolean){
    this.AccountService.changeAdmin(user, isAdmin);
  }

  toggleManager(user: User, isManager:boolean){
    this.AccountService.changeManager(user, isManager);
  }

  toggleBan(user: User){
    this.AccountService.changeBan(user, !user.Ban);
  }

  
}
