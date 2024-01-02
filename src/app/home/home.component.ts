import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Wycieczka } from '../wycieczka.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  wycieczki: Wycieczka[] = [];

  cheapest_trip: any;
  expensive_trip: any;
  reserved: Map<Wycieczka, number> = new Map();
  bought: Map<Wycieczka, number> = new Map();

  constructor(private http: HttpClient, private DataService: DataService, private modalService: NgbModal) { 
    console.log("constructor!");
  }

  ngOnInit(): void {
    this.DataService.trips$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.wycieczki = data;
    });
    this.DataService.reserved$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.reserved = data;
    })
    this.DataService.bought$.subscribe((data) => {
      if (data != null){
        this.bought = data;
      }
    })
    this.updateTrips();
    console.log("oninit!");
  }

  updateTrips(): void {
    this.findCheapestOption();
    this.findMostExpensiveOption();
  }

  reservePlace(wycieczka: Wycieczka): void {
    if ( this.reserved.get(wycieczka)! + this.bought.get(wycieczka)! < wycieczka.MaxIloscMiejsc){
      this.reserved.set(wycieczka, this.reserved.get(wycieczka)! + 1);
      this.DataService.updateReserved(this.reserved);
    }

  }

  cancelReservation(wycieczka: Wycieczka): void {
    if ( this.reserved.get(wycieczka)!> 0) {
        this.reserved.set(wycieczka, this.reserved.get(wycieczka)! - 1);
      this.DataService.updateReserved(this.reserved);
    }
  }

  findCheapestOption(): void {
    if (this.wycieczki.length > 0) {
      this.cheapest_trip = this.wycieczki[0];

      for (const wycieczka of this.wycieczki) {
        if (wycieczka.CenaJednostkowa < this.cheapest_trip.CenaJednostkowa) {
          this.cheapest_trip = wycieczka;
        }
      }
    }
  }

  findMostExpensiveOption():void  {
    if (this.wycieczki.length > 0) {
      this.expensive_trip = this.wycieczki[0];

      for (const wycieczka of this.wycieczki) {
        if (wycieczka.CenaJednostkowa > this.expensive_trip.CenaJednostkowa) {
          this.expensive_trip = wycieczka;
        }
      }
    }
  }

  deleteTrip(wycieczka: Wycieczka): void{
    const index = this.wycieczki.indexOf(wycieczka);
    if (index > -1){
      this.wycieczki.splice(index, 1);
    }
    this.DataService.updateTrips(this.wycieczki)
    if (this.reserved.has(wycieczka)){
      this.reserved.delete(wycieczka);
    }
    this.DataService.updateReserved(this.reserved);
    this.findCheapestOption();
    this.findMostExpensiveOption();
  }

  openFormModal(): void {
    const modalRef = this.modalService.open(ToolbarComponent, {
      centered: true,
      windowClass: 'modal-custom',
    });

    modalRef.result.then(
      (result) => {
        console.log('Modal zamykany. Wynik:', result);
        this.wycieczki.push(result);
        this.DataService.updateTrips(this.wycieczki);
        this.updateTrips();
      },
      (reason) => {
        console.log('Modal odrzucony. Powód:', reason);
      }
    );
  }
}
