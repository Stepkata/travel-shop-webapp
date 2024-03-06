import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Wycieczka } from '../../structures/wycieczka.model';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../structures/cart';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { Review } from '../../structures/review';
import { Photo } from '../../structures/photo';
import { time } from 'console';
import { AccountService } from '../../services/account.service';
import { HistoryItem } from '../../structures/history-item';
import { User } from '../../structures/user';


@Component({
  selector: 'app-wycieczka',
  templateUrl: './wycieczka.component.html',
  styleUrl: './wycieczka.component.css'
})
export class WycieczkaComponent implements OnInit{
  trips: Wycieczka[] = [];
  photos: Photo[] = [];
  reviews: Review[] = [];
  history: HistoryItem[] = [];
  cart: Cart = new Cart();
  isLoading: boolean = true;

  user: User| null = null;
  tripId: number = 0;
  wycieczka: Wycieczka | null = null;

  rating: number = 0;
  starCount: number = 5;
  ratingArr:any = [];

  rate: number = 1;

  constructor(private DataService: DataService, private route: ActivatedRoute, private modalService: NgbModal, private AccountService: AccountService) { 
    console.log("wycieczka constructor!");
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    let tripsLoading: boolean= true;
    let photosLoading: boolean= true;
    let reviewsLoading: boolean= true;
    let historyLoading: boolean = true;

    this.route.paramMap.subscribe(params => {
      this.tripId = parseInt(params.get('id')!);
    });

    this.AccountService.activeUser$.subscribe((data) => {
      this.user = data;
      this.DataService.history$.subscribe((data) => {
          if (data != null)
            this.history = data.filter(item => item.UserId == this.user?.Uid);
        });
        historyLoading = false;
        this.isLoading = photosLoading || tripsLoading || reviewsLoading || historyLoading;
    })

    this.DataService.trips$.subscribe((data: Wycieczka[]) => {
      if (data == null)
        console.log("null!");
      else{
        this.wycieczka = data.find(item => item.Id == this.tripId) || null;
        this.trips = data;
      }
      tripsLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading || historyLoading;
    });

    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.photos = data.filter(item => item.tripId == this.tripId);
      photosLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading|| historyLoading;
      }
    });

    this.DataService.reviews$.subscribe((data) => {
      if (data != null){
        this.reviews = data.filter(item => item.tripId === this.tripId);
      }
      reviewsLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading|| historyLoading;
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
        result.userId = "0";
        this.DataService.addReview(result);
        this.DataService.updateRating(this.tripId);
      },
      (reason) => {
        console.log('Modal odrzucony. Powód:', reason);
      }
    );
  }

  getFormatedDate(timestamp: any): string{
    if (!timestamp)
      return "";
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

  getCurrency(): string{
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

  canReview(): boolean{
    if (this.AccountService.checkAdmin() || this.AccountService.checkBanned()){
      return false;
    }
    if (this.AccountService.checkManager()){
      return true;
    }
    if (this.history.find(item => item.TripId == this.tripId && this.timeDifference(item) < 0))
      return true;
    else return false;
  }

  timeDifference(item: HistoryItem){
    const startDate = new Date(item.startDate);
      const currentDate = new Date();
      const timeDifference = startDate.getTime() - currentDate.getTime();

      // Convert milliseconds to days
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      return daysDifference;
  }
}


