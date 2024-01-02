import { Wycieczka } from "./wycieczka.model";

export class CartItem {
    wycieczka: Wycieczka;
    ilosc: number = 1;
    constructor(wycieczka: Wycieczka){
        this.wycieczka = wycieczka; 
    }

    get price():number{
        return this.wycieczka.CenaJednostkowa * this.ilosc;
    }
}
