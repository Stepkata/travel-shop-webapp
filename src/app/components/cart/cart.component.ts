import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { HistoryItem } from '../../structures/history-item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  reserved: Wycieczka[] = [];
  reservedMap: Map<Wycieczka, number> = new Map<Wycieczka, number>;
  num_reserved: number = 0;
  total: number = 0;

  constructor( private DataService: DataService) { 
    }

  ngOnInit() {
    this.DataService.reserved$.subscribe((data) => {
      if (data != null){
        this.total = 0;
        this.reserved = [];
        this.reservedMap = data;
        for (const [wycieczka, ilosc] of data) {
          if (ilosc != 0){
            this.total += ilosc * wycieczka.CenaJednostkowa;
            this.reserved.push(wycieczka);
          }
        }
      }
    });

  }

  reservePlace(wycieczka: Wycieczka): void {
    if ( this.reservedMap.get(wycieczka)! < wycieczka.MaxIloscMiejsc){
      this.reservedMap.set(wycieczka, this.reservedMap.get(wycieczka)! + 1);
      this.DataService.updateReserved(this.reservedMap);
    }

  }

  cancelReservation(wycieczka: Wycieczka): void {
    if ( this.reservedMap.get(wycieczka)!> 0) {
        this.reservedMap.set(wycieczka, this.reservedMap.get(wycieczka)! - 1);
      this.DataService.updateReserved(this.reservedMap);
    }
  }

  buy(wycieczka: Wycieczka){
    let history: HistoryItem[] = [];
    this.DataService.history$.subscribe((data) => {
      if (data != null){
        history = data;
      }
    })
    let newEntry: HistoryItem = {
      Trip: wycieczka,
      Amount: this.reservedMap.get(wycieczka)!,
      dateSold: new Date()
    }
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
    bought.set(wycieczka, alreadyBought + this.reservedMap.get(wycieczka)!);
    this.DataService.updateBought(bought);

    this.total = 0;
    this.reserved.splice(this.reserved.indexOf(wycieczka), 1);
    this.reservedMap.set(wycieczka, 0);
    this.DataService.updateReserved(this.reservedMap);
    for (const wycieczka of this.reserved){
      this.total += wycieczka.CenaJednostkowa * this.reservedMap.get(wycieczka)!;
    }

  }

  buyAll(){
    while(this.reserved.length > 0){
      this.buy(this.reserved[0]);
    }
  }

}
