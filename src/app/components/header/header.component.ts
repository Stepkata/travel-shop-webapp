import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Cart } from '../../structures/cart';
import { HistoryItem } from '../../structures/history-item';
import { AccountService } from '../../services/account.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  cart: Cart = new Cart();
  isSmallScreen = false;
  isLoggedIn: boolean = false;

  constructor( private DataService: DataService, private AccountService: AccountService) { 
  }

  ngOnInit(): void {
      this.DataService.cart$.subscribe((data) => {
        if (data != null){
          this.cart = data;
        }
      });
    this.AccountService.isLoggedIn$.subscribe((data) => {
      if (data != null){
        this.isLoggedIn = data;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Update the isSmallScreen property based on the window width
    this.isSmallScreen = window.innerWidth <= 768; // Adjust the breakpoint as needed
  }

}
