import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { HistoryItem } from '../../structures/history-item';
import { Cart } from '../../structures/cart';
import { CartItem } from '../../structures/cart-item';
import { Photo } from '../../structures/photo';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  trips: Wycieczka[] = [];
  cart: Cart = new Cart();
  photos: Photo[] = [];
  isLoading: boolean = true;
  rate: number = 1;
  userId: string = "";

  constructor( private DataService: DataService, private AccountService: AccountService) { 
  }

  ngOnInit() {
    let tripsLoading: boolean= true;
    let photosLoading: boolean= true;
    let accountLoading: boolean = true;
    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
    this.DataService.trips$.subscribe((data) => {
      if (data != null){
        this.trips = data;
      }
      tripsLoading = false;
      this.isLoading = photosLoading || tripsLoading || accountLoading;
    });
    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.photos = data;
      }
      photosLoading = false;
      this.isLoading = photosLoading || tripsLoading || accountLoading;
    });
    this.AccountService.activeUser$?.subscribe((data) =>{
      if (data != null)
        this.userId = data.Uid;
      accountLoading = false;
      this.isLoading = photosLoading || tripsLoading || accountLoading;
    }
    )
    this.DataService.rate$.subscribe((data) => {
      if (data != null){
        this.rate = data;
      }
    });
  }

  reservePlace(wycieczka: Wycieczka, event:any): void {
    if ( wycieczka.IloscMiejsc > 0){
      this.cart.addItem(wycieczka);
      this.DataService.updateCart(this.cart);
      let newIlosc = wycieczka.IloscMiejsc - 1;
      this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
    }
    event.stopPropagation()

  }

  cancelReservation(wycieczka: Wycieczka,  event:any): void {
    if (this.cart.getReservedNum(wycieczka) > 0) {
        this.cart.removeItem(wycieczka);
        this.DataService.updateCart(this.cart);
        let newIlosc = wycieczka.IloscMiejsc + 1;
        this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
    }
    event.stopPropagation()
  }

  buy(wycieczka: Wycieczka){
    let newIlosc = wycieczka.IloscMiejsc - this.cart.getReservedNum(wycieczka);
    let newEntry: HistoryItem | null = this.cart.buy(wycieczka, this.userId);
    if (newEntry === null)
      return;
    this.DataService.addHistory(newEntry);
    this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
  }

  buyAll(){
    
    let newHistory: HistoryItem[] = this.cart.buyAll(this.userId);
    if (!newHistory)
      return;
    for (const item of newHistory){
      this.DataService.addHistory(item);
      let wycieczka: Wycieczka = this.trips.find(i => i.Id === item.TripId)!;
      let newIlosc = wycieczka.IloscMiejsc - item.Amount;
      this.DataService.updateIloscMiejsc(item.TripId, newIlosc);
    }

  }

  getTrip(id: number): Wycieczka{
    return this.trips.find(i => i.Id === id)!
  }

  getPhoto(id: number): string {
    return this.photos.find(i => i.tripId === id)?.url || "";
  }

  onChangeCheckbox(cartItem: CartItem){
    cartItem.checked = !cartItem.checked;
  }

  getCurrency(){
    if (this.rate == 4.5){
      return 'EUR';
    }
    if (this.rate == 4){
      return 'USD';
    }
    if (this.rate == 5){
      return 'GBP';
    }
    return 'PLN';
  }

}
