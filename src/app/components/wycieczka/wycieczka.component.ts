import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Wycieczka } from '../../structures/wycieczka.model';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../structures/cart';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { Review } from '../../structures/review';
import { Photo } from '../../structures/photo';


@Component({
  selector: 'app-wycieczka',
  templateUrl: './wycieczka.component.html',
  styleUrl: './wycieczka.component.css'
})
export class WycieczkaComponent implements OnInit{
  trips: Wycieczka[] = [];
  photos: Photo[] = [];
  reviews: Review[] = [];
  cart: Cart = new Cart();

  tripId: number = 0;
  wycieczka: Wycieczka | null = null;

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
        this.wycieczka = data.find(item => item.Id == this.tripId) || null;
        this.trips = data;
      }
    });

    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.photos = data;
      }
    });

    this.DataService.reviews$.subscribe((data) => {
      if (data != null){
        this.reviews = data;
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
          IloscMiejsc: 0,
          Opis: "",
          DlugiOpis: ""
      }
    };

    this.rating = this.getRating();

    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
  }

  reservePlace(wycieczka: Wycieczka): void {
    if ( this.wycieczka?.IloscMiejsc! > 0){
      this.cart.addItem(wycieczka);
      this.DataService.updateCart(this.cart);
      let newIlosc = wycieczka.IloscMiejsc - 1;
      this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
    }
  }

  cancelReservation(wycieczka: Wycieczka): void {
    if (this.cart.getReservedNum(wycieczka) > 0) {
        this.cart.removeItem(wycieczka);
        this.DataService.updateCart(this.cart);
        let newIlosc = wycieczka.IloscMiejsc + 1;
      this.DataService.updateIloscMiejsc(wycieczka.Id, newIlosc);
    }
  }

  getRating(): number{
    console.log("home rating");
    let sum = 0;
    let oceny = this.reviews.filter(item => item.tripId === this.tripId);
    for (const r of oceny){
      sum += r.rating;
    }
    return sum/oceny.length;
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
    return this.photos.filter(item => item.tripId === this.tripId);
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
        this.DataService.addReview(result);
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
