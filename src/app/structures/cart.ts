import { Wycieczka } from "./wycieczka.model";
import { CartItem } from "./cart-item";
import { HistoryItem } from "./history-item";

export class Cart{
    items: CartItem[];
    total: number = 0;
    constructor(){
        this.items = [];
    }

    addItem(wycieczka: Wycieczka){
        let item = this.items.find(obj => obj.id === wycieczka.Id)

        if (item === undefined){
            this.items.push(new CartItem(wycieczka.Id, wycieczka.CenaJednostkowa));
        } else{
            item.addItem();
        }
    }

    removeItem(wycieczka: Wycieczka){
        let item = this.items.find(obj => obj.id === wycieczka.Id)

        if (item === undefined){
            this.items.push(new CartItem(wycieczka.Id, wycieczka.CenaJednostkowa));
        } else{
            item.removeItem();
            if (item.reservedNum == 0){
                this.removeItemFromCart(wycieczka);
            }
        }
    }

    removeItemFromCart(wycieczka: Wycieczka){
        this._removeItemFromCart(wycieczka.Id);
    }

    _removeItemFromCart(id: number){
        let indexToRemove = this.items.findIndex(obj => obj.id === id);

        if (indexToRemove !== -1) {
            this.items.splice(indexToRemove, 1);
            this.getTotal();
        }
    }

    getTotal(){
        this.total = 0;
        let itemsToBuy = this.items.filter(item => item.checked);
        for (const item of itemsToBuy){
            this.total += item.getTotal();
        }
        return this.total;
    }

    getReservedNum(wycieczka: Wycieczka){
        let item = this.items.find(obj => obj.id === wycieczka.Id)

        if (item === undefined){
            return 0;
        } else{
            return item.reservedNum;
        }
    }

    getAmount(){
        return this.items.length;
    }

    buy(wycieczka: Wycieczka){
        let item = this.items.find(obj => obj.id === wycieczka.Id)

        if (item === undefined || item.checked === false){
            return null
        } else{
            let newEntry: HistoryItem = {
                TripId: item.id,
                Amount: item.reservedNum,
                Total: item.getTotal(),
                dateSold: new Date()
              }
            this._removeItemFromCart(item.id);
            return newEntry;
        }
    }

    buyAll(){
        let itemsToBuy = this.items.filter(item => item.checked);
        let history: HistoryItem[] = [];
        for (const item of itemsToBuy){
            let newEntry: HistoryItem = {
                TripId: item.id,
                Amount: item.reservedNum,
                Total: item.getTotal(),
                dateSold: new Date()
              }
            this._removeItemFromCart(item.id);
            history.push(newEntry)
        }
        return history;
    }
}