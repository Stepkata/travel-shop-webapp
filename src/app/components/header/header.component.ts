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
  history: HistoryItem[] = [];

  oncoming:boolean = false;
  isLoading: boolean = true;
  comingStart: string = "";
  comingName: string = "";

  constructor( private DataService: DataService, private AccountService: AccountService) { 
  }

  ngOnInit(): void {
    this.DataService.history$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.history = data;
      this.checkTripNotif();
      this.isLoading = false;
    });
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

  checkTripNotif(){
    for (const item of this.history){
      const startDate = new Date(item.startDate);
      const currentDate = new Date();
      const timeDifference = startDate.getTime() - currentDate.getTime();

      // Convert milliseconds to days
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      // Check if the difference is less than 4 days
      if (daysDifference > 0 && daysDifference < 4){
        this.oncoming = true;
        this.comingName = item.Name;
        this.comingStart = item.startDate;
        return;
      }
    }
    this.oncoming = false;
  }


}
