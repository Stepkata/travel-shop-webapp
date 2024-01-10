import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Wycieczka } from '../../structures/wycieczka.model';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../structures/cart';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { Review } from '../../structures/review';
import { Photo } from '../../structures/photo';
import { time } from 'console';


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
  isLoading: boolean = true;

  tripId: number = 0;
  wycieczka: Wycieczka | null = null;

  rating: number = 0;
  starCount: number = 5;
  ratingArr:any = [];

  rate: number = 1;

  constructor(private DataService: DataService, private route: ActivatedRoute, private modalService: NgbModal) { 
    console.log("wycieczka constructor!");
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    let tripsLoading: boolean= true;
    let photosLoading: boolean= true;
    let reviewsLoading: boolean= true;

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
      tripsLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading;
    });

    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.photos = data.filter(item => item.tripId == this.tripId);
      photosLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading;
      }
    });

    this.DataService.reviews$.subscribe((data) => {
      if (data != null){
        this.reviews = data.filter(item => item.tripId === this.tripId);
      }
      reviewsLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading;
    });

    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });

    this.DataService.rate$.subscribe((data) => {
      if (data != null){
        this.rate = data;
      }
    });
  }

  reservePlace(): void {
    if ( this.wycieczka!.IloscMiejsc! - this.cart.getReservedNum(this.wycieczka!) > 0){
      this.cart.addItem(this.wycieczka!);
      this.DataService.updateCart(this.cart);
    }
  }

  cancelReservation(): void {
    if (this.cart.getReservedNum(this.wycieczka!) > 0) {
        this.cart.removeItem(this.wycieczka!);
        this.DataService.updateCart(this.cart);
    }
  }

  getRating(): number{
    let oceny = this.reviews.filter(item => item.tripId === this.tripId);
    return oceny.length;
  }

  showIcon(index:number, rating:number=this.wycieczka!.Ocena) {
    if (rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
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
        this.DataService.updateRating(this.tripId);
      },
      (reason) => {
        console.log('Modal odrzucony. Powód:', reason);
      }
    );
  }

  getFormatedDate(timestamp: any){
    if (!timestamp)
      return null;
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

  getCurrency(){
    if (this.rate == 4.5){
      return 'EUR';
    }
    if (this.rate == 4){
      return 'USD';
    }
    if (this.rate == 5){
      return 'GBP';
    }
    return 'PLN';
  }
}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
