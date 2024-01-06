import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { Wycieczka } from '../../structures/wycieczka.model';
import { Cart } from '../../structures/cart';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css'
})
export class WidgetComponent {
  cart: Cart = new Cart();

  constructor( private DataService: DataService) { 
    }

  ngOnInit() {
    this.DataService.cart$.subscribe((data) => {
      if (data != null){
        this.cart = data;
      }
    });
  }

}
