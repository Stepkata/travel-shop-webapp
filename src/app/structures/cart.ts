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
            this.items.push(new CartItem(wycieczka));
        } else{
            item.addItem();
        }
    }

    removeItem(wycieczka: Wycieczka){
        let item = this.items.find(obj => obj.id === wycieczka.Id)

        if (item === undefined){
            this.items.push(new CartItem(wycieczka));
        } else{
            item.removeItem();
        }
    }

    removeItemFromCart(wycieczka: Wycieczka){
        let indexToRemove = this.items.findIndex(obj => obj.id === wycieczka.Id);

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
                Trip: item.trip,
                Amount: item.reservedNum,
                Total: item.getTotal(),
                dateSold: new Date()
              }
            this.removeItemFromCart(item.trip);
            return newEntry;
        }
    }

    buyAll(){
        let itemsToBuy = this.items.filter(item => item.checked);
        let history: HistoryItem[] = [];
        for (const item of itemsToBuy){
            let newEntry: HistoryItem = {
                Trip: item.trip,
                Amount: item.reservedNum,
                Total: item.getTotal(),
                dateSold: new Date()
              }
            this.removeItemFromCart(item.trip);
            history.push(newEntry)
        }
        return history;
    }
}