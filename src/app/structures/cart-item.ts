import { Wycieczka } from "./wycieczka.model";

export class CartItem {
    trip: Wycieczka; // Assuming you have a Trip class or interface
    id: number;
    reservedNum: number;
    total: number;
    checked: boolean;
  
    constructor(trip: Wycieczka) {
      this.trip = trip;
      this.id = trip.Id;
      this.reservedNum = 1;
      this.total = this.getTotal();
      this.checked = true;
    }

    getTotal(){
        return this.reservedNum * this.trip.CenaJednostkowa;
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
  