import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  wycieczki: any[] = [];
  ilosciMiejscMap: Map<any, number> = new Map();
  cheapest_trip: any;
  expensive_trip: any;
  reserved: Map<any, number> = new Map();

  constructor(private http: HttpClient, private DataService: DataService) { }

  ngOnInit(): void {
    this.http.get<any[]>('assets/wycieczki.json').subscribe(data => {
      this.wycieczki = data;
    });
    for (const wycieczka of this.wycieczki) {
      // Ustaw ilość miejsc na przykładową wartość, dostosuj do swoich danych
      const iloscMiejsc = wycieczka.MaxIloscMiejsc || 0;
      this.ilosciMiejscMap.set(wycieczka, iloscMiejsc);
    }
    this.DataService.updateTrips(this.wycieczki);
    this.findCheapestOption();
    this.findMostExpensiveOption();
  }

  reservePlace(wycieczka: any): void {
    if ( this.ilosciMiejscMap.get(wycieczka)! > 0) {
      let new_val = this.ilosciMiejscMap.get(wycieczka)!-1;
      this.ilosciMiejscMap.set(wycieczka, new_val);
      if (!this.reserved.has(wycieczka)){
        this.reserved.set(wycieczka, 1);
      } else{
        this.reserved.set(wycieczka, this.reserved.get(wycieczka)! + 1);
      }
      this.DataService.updateReserved(this.reserved);
    }
  }

  cancelReservation(wycieczka: any): void {
    if ( this.ilosciMiejscMap.get(wycieczka)! < wycieczka.MaxIloscMiejsc) {
      let new_val = this.ilosciMiejscMap.get(wycieczka)!+1;
      this.ilosciMiejscMap.set(wycieczka, new_val);
      if (new_val == wycieczka.MaxIloscMiejsc){
        this.reserved.delete(wycieczka)
      } else{
        this.reserved.set(wycieczka, wycieczka.MaxIloscMiejsc - new_val);
      }
      this.DataService.updateReserved(this.reserved);
    }
  }

  findCheapestOption() {
    if (this.wycieczki.length > 0) {
      this.cheapest_trip = this.wycieczki[0];

      for (const wycieczka of this.wycieczki) {
        if (wycieczka.CenaJednostkowa < this.cheapest_trip.CenaJednostkowa) {
          this.cheapest_trip = wycieczka;
        }
      }
    }
  }

  findMostExpensiveOption() {
    if (this.wycieczki.length > 0) {
      this.expensive_trip = this.wycieczki[0];

      for (const wycieczka of this.wycieczki) {
        if (wycieczka.CenaJednostkowa > this.expensive_trip.CenaJednostkowa) {
          this.expensive_trip = wycieczka;
        }
      }
    }
  }

  deleteTrip(wycieczka: any){
    const index = this.wycieczki.indexOf(wycieczka);
    if (index > -1){
      this.wycieczki.splice(index, 1);
    }
    this.DataService.updateTrips(this.wycieczki)
    if (this.ilosciMiejscMap.has(wycieczka)){
      this.ilosciMiejscMap.delete(wycieczka);
    }
    if (this.reserved.has(wycieczka)){
      this.reserved.delete(wycieczka);
    }
    this.DataService.updateReserved(this.reserved);
    this.findCheapestOption();
    this.findMostExpensiveOption();
  }
}
