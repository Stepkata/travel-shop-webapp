import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { Cart } from '../../structures/cart';
import { Photo } from '../../structures/photo';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css'
})
export class WidgetComponent {
  cart: Cart = new Cart();
  photos: Photo[] = [];
  isLoading: boolean = true;
  rate: number = 1;

  constructor( private DataService: DataService) { 
    }

  ngOnInit() {
    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
    this.DataService.photos$.subscribe((data) => {
      if (data != null){
        this.photos = data;
      }
      this.isLoading = false;
    });
    this.DataService.rate$.subscribe((data) => {
      if (data != null){
        this.rate = data;
      }
    });
  }

  getPhoto(wycieczka: Wycieczka): string{
    let photo:Photo[] = this.photos.filter(item => item.tripId == wycieczka.Id && item.thumbnail);
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

}
