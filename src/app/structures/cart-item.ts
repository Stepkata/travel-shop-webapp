import { DataService } from "../services/data.service";
import { Wycieczka } from "./wycieczka.model";

export class CartItem {
    trip: Wycieczka;
    id: number;
    price: number;
    reservedNum: number;
    total: number;
    checked: boolean;
  
    constructor(trip:Wycieczka) {
      this.trip = trip;
      this.id = trip.Id;
      this.price = trip.CenaJednostkowa;
      this.reservedNum = 1;
      this.total = this.getTotal();
      this.checked = true;
    }

    getTotal(){
        return this.reservedNum * this.price;
    }

    addItem(){
        this.reservedNum += 1;
        this.total = this.getTotal();
    }

    removeItem(){
      this.reservedNum -= 1;
      this.total = this.getTotal();
    }
  }
  