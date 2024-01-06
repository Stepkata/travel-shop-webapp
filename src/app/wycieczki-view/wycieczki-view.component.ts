import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Wycieczka } from '../wycieczka.model';

@Component({
  selector: 'app-wycieczki-view',
  templateUrl: './wycieczki-view.component.html',
  styleUrl: './wycieczki-view.component.css'
})
export class WycieczkiViewComponent {
  wycieczki: Wycieczka[] = [];

  cheapest_trip: any;
  expensive_trip: any;
  reserved: Map<Wycieczka, number> = new Map();
  bought: Map<Wycieczka, number> = new Map();
  starCount: number = 5;
  ratingArr:any = [];
  filterBy: string = '';
  filterData: any = {}; 

  constructor(private http: HttpClient, private DataService: DataService, private modalService: NgbModal) { 
    console.log("constructor!");
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
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

  reservePlace(wycieczka: Wycieczka, event:any): void {
    if ( this.reserved.get(wycieczka)! + this.bought.get(wycieczka)! < wycieczka.MaxIloscMiejsc){
      this.reserved.set(wycieczka, this.reserved.get(wycieczka)! + 1);
      this.DataService.updateReserved(this.reserved);
    }
    event.stopPropagation()

  }

  cancelReservation(wycieczka: Wycieczka,  event:any): void {
    if ( this.reserved.get(wycieczka)!> 0) {
        this.reserved.set(wycieczka, this.reserved.get(wycieczka)! - 1);
      this.DataService.updateReserved(this.reserved);
    }
    event.stopPropagation()
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

  getRating(wycieczka: Wycieczka): number{
    console.log("home rating");
    let sum = 0;
    for (const r of wycieczka.Rating){
      sum += r;
    }
    return sum/wycieczka.Rating.length;
  }

  showIcon(wycieczka:Wycieczka, index:number) {
    if (this.getRating(wycieczka)>= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  applyFilter(filterData: any) {
    this.filterData = filterData;
  }

}
