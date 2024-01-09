import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Wycieczka } from '../../structures/wycieczka.model';
import { FiltrComponent } from '../filtr/filtr.component';

import { CountryPipe } from '../../pipes/country.pipe';
import { DatePipe } from '@angular/common';
import { PricePipe } from '../../pipes/price.pipe';
import { RatingPipe } from '../../pipes/rating.pipe';
import { SlicePagesPipe } from '../../pipes/slice-pages.pipe';
import { Cart } from '../../structures/cart';
import { Photo } from '../../structures/photo';
import { Review } from '../../structures/review';


@Component({
  selector: 'app-wycieczki-view',
  templateUrl: './wycieczki-view.component.html',
  styleUrl: './wycieczki-view.component.css',
  providers: [CountryPipe, 
    DatePipe,
    PricePipe,
    RatingPipe,
    SlicePagesPipe
  ]
})
export class WycieczkiViewComponent {
  wycieczki: Wycieczka[] = [];
  zdjecia: Photo[] = [];
  reviews: Review[] = [];

  cheapest_trip: any;
  expensive_trip: any;
  cart: Cart = new Cart();



  starCount: number = 5;
  ratingArr:any = [];
  
  filterCountry: any = [];
  filterMinRating: any = null;
  filterMaxRating: any = null;
  filterMinPrice: any = null;
  filterMaxPrice: any = null;
  filterStartDate: any = null;
  filterEndDate: any = null;

  amountToShow: number = 5;
  currentPage: number = 0;


  constructor(private http: HttpClient, private DataService: DataService, private modalService: NgbModal) { 
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    this.DataService.trips$.subscribe((data) => {
      if (data != null)
        this.wycieczki = data;
    });

    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.zdjecia = data;
      }
    });

    this.DataService.reviews$.subscribe((data) => {
      if (data != null){
        this.reviews = data;
      }
    });

    this.updateSpecialTrips();
  }

  updateSpecialTrips(): void {
    this.findCheapestOption();
    this.findMostExpensiveOption();
  }

  reservePlace(wycieczka: Wycieczka, event:any): void {
    if ( wycieczka.IloscMiejsc > 0){
      this.cart.addItem(wycieczka);
      this.DataService.updateCart(this.cart);
      let newIlosc = wycieczka.IloscMiejsc - 1;
      this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
    }
    event.stopPropagation()
  }

  cancelReservation(wycieczka: Wycieczka,  event:any): void {
    this._cancelReservation(wycieczka);
    event.stopPropagation()
  }

  _cancelReservation(wycieczka: Wycieczka): void {
    if (this.cart.getReservedNum(wycieczka) > 0) {
        this.cart.removeItem(wycieczka);
        this.DataService.updateCart(this.cart);
        let newIlosc = wycieczka.IloscMiejsc + 1;
      this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
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
    let numReserved = this.cart.getReservedNum(wycieczka);
        for (let i=0; i<numReserved; i++){
          this._cancelReservation(wycieczka);
        }
    this.DataService.deleteTrip(wycieczka.Id); //@TODO: check
    this.ngOnInit();
  }

  openFilterModal(): void {
    const modalRef = this.modalService.open(FiltrComponent, {
      centered: true,
      windowClass: 'modal-custom',
    });

    modalRef.result.then(
      (result) => {
        console.log('Modal zamykany. Wynik:', result);
        this.filterCountry = result.lokalizacja;
        this.filterMinRating = result.ocenaMin;
        this.filterMaxRating = result.ocenaMax;
        this.filterMinPrice = result.cenaMin;
        this.filterMaxPrice = result.cenaMax;
        this.filterStartDate = result.dataOd? new Date(result.dataOd) : result.dataOd;
        this.filterEndDate = result.dataDo? new Date(result.dataDo) : result.dataDo;

      },
      (reason) => {
        console.log('Modal odrzucony. Powód:', reason);
      }
    );

  }

  clearFilters(){
    this.filterCountry = [];
    this.filterMinRating = null;
    this.filterMaxRating = null;
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.filterStartDate = null;
    this.filterEndDate = null;
  }

  getRating(wycieczka: Wycieczka): number{
    console.log("home rating");
    let sum = 0;
    let oceny = this.reviews.filter(item => item.tripId === wycieczka.Id);
    for (const r of oceny){
      sum += r.rating;
    }
    return sum/oceny.length;
  }

  showIcon(wycieczka:Wycieczka, index:number) {
    if (this.getRating(wycieczka)>= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  setAmountToShow(n: number){
    this.amountToShow = n;
    this.currentPage = 0;
  }

  changePage(i: number){
    this.currentPage += i;
    if(this.currentPage <0)
      this.currentPage = 0;
  }

  createRange(n: number): any[] {
    return new Array(n);
  }


}
