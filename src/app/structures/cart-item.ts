import { DataService } from "../data.service";
import { Wycieczka } from "./wycieczka.model";

export class CartItem {
    id: number;
    price: number;
    reservedNum: number;
    total: number;
    checked: boolean;
  
    constructor(tripId: number, price: number) {
      this.id = tripId;
      this.price = price;
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
  