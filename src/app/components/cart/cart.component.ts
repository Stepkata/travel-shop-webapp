import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { HistoryItem } from '../../structures/history-item';
import { Cart } from '../../structures/cart';
import { CartItem } from '../../structures/cart-item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  bought: Map<Wycieczka, number> = new Map();
  cart: Cart = new Cart();

  constructor( private DataService: DataService) { 
    }

  ngOnInit() {
    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
    this.DataService.bought$.subscribe((data) => {
      if (data != null){
        this.bought = data;
      }
    });

  }

  reservePlace(wycieczka: Wycieczka, event:any): void {
    if ( this.cart.getReservedNum(wycieczka) + this.bought.get(wycieczka)! < wycieczka.MaxIloscMiejsc){
      this.cart.addItem(wycieczka);
      this.DataService.updateCart(this.cart);
    }
    event.stopPropagation()

  }

  cancelReservation(wycieczka: Wycieczka,  event:any): void {
    if (this.cart.getReservedNum(wycieczka) > 0) {
        this.cart.removeItem(wycieczka);
        this.DataService.updateCart(this.cart);
    }
    event.stopPropagation()
  }

  buy(wycieczka: Wycieczka){
    let history: HistoryItem[] = [];
    this.DataService.history$.subscribe((data) => {
      if (data != null){
        history = data;
      }
    })

    let newEntry: HistoryItem | null = this.cart.buy(wycieczka);
    if (newEntry === null)
      return;
    history.push(newEntry);
    this.DataService.updateHistory(history);

    let bought: Map<Wycieczka, number> = new Map();
    this.DataService.bought$.subscribe((data) => {
      if (data != null){
        bought = data;
      }
    })
    let alreadyBought = 0;
    if (bought.has(wycieczka)){
      alreadyBought = bought.get(wycieczka)!;
    }
    bought.set(wycieczka, alreadyBought + newEntry.Amount);
    this.DataService.updateBought(bought);

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
    history.push(...newHistory);
    console.log("History", history);
    this.DataService.updateHistory(history);

    let bought: Map<Wycieczka, number> = new Map();
    this.DataService.bought$.subscribe((data) => {
      if (data != null){
        bought = data;
      }
    })

    for (const item of newHistory){
      let alreadyBought = 0;
      if (bought.has(item.Trip)){
        alreadyBought = bought.get(item.Trip)!;
      }
      bought.set(item.Trip, alreadyBought + item.Amount);
      this.DataService.updateBought(bought);
    }

  }

  onChangeCheckbox(cartItem: CartItem){
    cartItem.checked = !cartItem.checked;
  }

}
