import { Component } from '@angular/core';
import { DataService } from '../../data.service';
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
  }

  getPhoto(wycieczka: Wycieczka): string{
    let photo:Photo[] = this.photos.filter(item => item.tripId == wycieczka.Id && item.thumbnail);
    return photo[0].url;
  }

}
