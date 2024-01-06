import { Wycieczka } from "./wycieczka.model";
import { CartItem } from "./cart-item";

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
        let indexToRemove = this.items.findIndex(obj => obj.id === wycieczka.Id);

        if (indexToRemove !== -1) {
            this.items.splice(indexToRemove, 1);
            this.getTotal();
        }
    }

    getTotal(){
        for (const item of this.items){
            this.total += item.getTotal();
        }
        return this.total;
    }
}