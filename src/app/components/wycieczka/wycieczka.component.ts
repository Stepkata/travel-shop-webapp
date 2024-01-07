import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Wycieczka } from '../../structures/wycieczka.model';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../structures/cart';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { Review } from '../../structures/review';


@Component({
  selector: 'app-wycieczka',
  templateUrl: './wycieczka.component.html',
  styleUrl: './wycieczka.component.css'
})
export class WycieczkaComponent implements OnInit{
  wycieczka: any;
  tripId: number = 0;
  bought: Map<Wycieczka, number> = new Map();
  reviews: Map<number, Review[]> = new Map();
  trips: Wycieczka[] = [];
  cart: Cart = new Cart();

  rating: number = 0;
  starCount: number = 5;
  ratingArr:any = [];

  constructor(private DataService: DataService, private route: ActivatedRoute, private modalService: NgbModal) { 
    console.log("wycieczka constructor!");
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tripId = parseInt(params.get('id')!);
    });

    this.DataService.trips$.subscribe((data: Wycieczka[]) => {
      if (data == null)
        console.log("null!");
      else{
        this.wycieczka = data.find(item => item.Id == this.tripId);
        this.trips = data;
      }
    });

    if(!this.wycieczka){
      this.wycieczka = {
          Id: this.tripId,
          Nazwa: "",
          Kraj: "",
          DataRozpoczecia: "",
          DataZakonczenia: "",
          CenaJednostkowa: 0,
          MaxIloscMiejsc: 0,
          Opis: "",
          DlugiOpis: "",
          Zdjecie:"",
          DodatkoweZdjecia: [],
          Rating: []
      }
    };

    this.rating = this.getRating();
    
    this.DataService.bought$.subscribe((data) => {
      if (data != null){
        this.bought = data;
      }
    });

    this.DataService.review$.subscribe((data) => {
      if (data != null){
        this.reviews = data;
      }
    });

    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
  }

  reservePlace(wycieczka: Wycieczka): void {
    if ( this.cart.getReservedNum(wycieczka) + this.bought.get(wycieczka)! < wycieczka.MaxIloscMiejsc){
      this.cart.addItem(wycieczka);
      this.DataService.updateCart(this.cart);
    }
  }

  cancelReservation(wycieczka: Wycieczka): void {
    if (this.cart.getReservedNum(wycieczka) > 0) {
        this.cart.removeItem(wycieczka);
        this.DataService.updateCart(this.cart);
    }
  }
  getRating(): number{
    if (!this.wycieczka.Rating)
      return 0;
    let sum = 0;
    for (const r of this.wycieczka.Rating){
      sum += r;
    }
    return sum/this.wycieczka.Rating.length;
  }

  onClick(rating:number) {
    console.log(rating)
    this.rating = rating;
    this.wycieczka.Rating.push(this.rating);
    this.trips[this.tripId-1] = this.wycieczka;
    this.DataService.updateTrips(this.trips);
    return false;
  }

  showIcon(index:number, rating:number=this.rating) {
    if (rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  getSlides(wycieczka:Wycieczka){
    if (!wycieczka)
      return;
    return [wycieczka.Zdjecie, ...wycieczka.DodatkoweZdjecia];
  }

  openFormModal(): void {
    const modalRef = this.modalService.open(ReviewFormComponent, {
      centered: true,
      windowClass: 'modal-custom',
    });

    modalRef.result.then(
      (result) => {
        console.log('Modal zamykany. Wynik:', result);
        result.tripId = this.tripId;
        result.userId = 0;
        if (this.reviews.has(this.tripId)){
          this.reviews.get(this.tripId)?.push(result);
        } else{
          this.reviews.set(this.tripId, [result]);
        }
        this.DataService.updateReviews(this.reviews);
        this.rating = result.rating;
        this.wycieczka.Rating.push(this.rating);
        this.trips[this.tripId-1] = this.wycieczka;
        this.DataService.updateTrips(this.trips);
      },
      (reason) => {
        console.log('Modal odrzucony. Powód:', reason);
      }
    );
  }
}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
