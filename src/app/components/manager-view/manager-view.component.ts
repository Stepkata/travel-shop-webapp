import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Wycieczka } from '../../structures/wycieczka.model';
import { FiltrComponent } from '../filtr/filtr.component';
import { Cart } from '../../structures/cart';
import { Photo } from '../../structures/photo';
import { Review } from '../../structures/review';

@Component({
  selector: 'app-manager-view',
  templateUrl: './manager-view.component.html',
  styleUrl: './manager-view.component.css'
})
export class ManagerViewComponent {
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

  isLoading: boolean = true;

  rate: number = 1;


  constructor(private http: HttpClient, private DataService: DataService, private modalService: NgbModal) { 
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    let tripsLoading: boolean= true;
    let photosLoading: boolean= true;
    let reviewsLoading: boolean= true;

    this.DataService.trips$.subscribe((data) => {
      if (data != null)
        this.wycieczki = data;
      tripsLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading;
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
      photosLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading;
    });

    this.DataService.reviews$.subscribe((data) => {
      if (data != null){
        this.reviews = data;
      }
      reviewsLoading = false;
      this.isLoading = photosLoading || tripsLoading || reviewsLoading;
    });

    this.DataService.rate$.subscribe((data) => {
      if (data != null){
        this.rate = data;
      }
    })
  }

  deleteTrip(wycieczka: Wycieczka, event: any): void{
    this.wycieczki.splice(this.wycieczki.indexOf(wycieczka), 1);
    this.DataService.deleteTrip(wycieczka.Id); //@TODO: check
    event.stopPropagation();
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

  showIcon(wycieczka:Wycieczka, index:number) {
    if (wycieczka.Ocena>= index + 1) {
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
    let maxPages = Math.floor(this.wycieczki.length/this.amountToShow);
    if(this.currentPage > maxPages)
      this.currentPage = maxPages;
  }

  createRange(n: number): any[] {
    return new Array(n);
  }

  getPhoto(wycieczka: Wycieczka): string{
    if (!this.zdjecia)
      return "";
    let photo:Photo[] = this.zdjecia.filter(item => item.tripId == wycieczka.Id && item.thumbnail);
    if (!photo || photo.length == 0)
      return "";
    return photo[0].url;
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

  setRate(rate:number){
    this.rate = rate;
    this.DataService.updateRate(rate);
  }

}
