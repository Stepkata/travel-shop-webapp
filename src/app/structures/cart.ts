import { Wycieczka } from "./wycieczka.model";
import { CartItem } from "./cart-item";
import { HistoryItem } from "./history-item";
import { AccountService } from "../services/account.service";

export class Cart{
    items: CartItem[];
    total: number = 0;
    userId: string = "";
    
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

    buy(wycieczka: Wycieczka, userId:string){
        let item = this.items.find(obj => obj.id === wycieczka.Id)

        if (item === undefined || item.checked === false){
            return null
        } else{
            let newEntry: HistoryItem = {
                TripId: item.id,
                UserId: userId,
                Amount: item.reservedNum,
                Total: item.getTotal(),
                Name: item.trip.Nazwa,
                Country: item.trip.Kraj,
                Description: item.trip.Opis,
                dateSold: new Date(),
                startDate: item.trip.DataRozpoczecia,
                endDate: item.trip.DataZakonczenia,
              }
            this._removeItemFromCart(item.id);
            return newEntry;
        }
    }

    buyAll(userId: string){
        let itemsToBuy = this.items.filter(item => item.checked);
        let history: HistoryItem[] = [];
        for (const item of itemsToBuy){
            let newEntry: HistoryItem = {
                TripId: item.id,
                UserId: userId,
                Amount: item.reservedNum,
                Total: item.getTotal(),
                Name: item.trip.Nazwa,
                Country: item.trip.Kraj,
                Description: item.trip.Opis,
                dateSold: new Date(),
                startDate: item.trip.DataRozpoczecia,
                endDate: item.trip.DataZakonczenia,
              }
            this._removeItemFromCart(item.id);
            history.push(newEntry)
        }
        return history;
    }
}