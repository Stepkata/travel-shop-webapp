import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { HistoryItem } from '../../structures/history-item';
import { Cart } from '../../structures/cart';
import { CartItem } from '../../structures/cart-item';
import { Photo } from '../../structures/photo';
import { isLoading } from 'expo-font';

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

  constructor( private DataService: DataService) { 
    }

  ngOnInit() {
    let tripsLoading: boolean= true;
    let photosLoading: boolean= true;
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
      this.isLoading = photosLoading || tripsLoading ;
    });
    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.photos = data;
      }
      photosLoading = false;
      this.isLoading = photosLoading || tripsLoading ;
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
    let newEntry: HistoryItem | null = this.cart.buy(wycieczka);
    if (newEntry === null)
      return;
    this.DataService.addHistory(newEntry);
  }

  buyAll(){
    let newHistory: HistoryItem[] = this.cart.buyAll();
    console.log("New history", newHistory);
    let history: HistoryItem[] = [];
    this.DataService.history$.subscribe((data) => {
      if (data != null){
        history = data;
      }
    })
    for (const item of newHistory)
      this.DataService.addHistory(item);

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

}
