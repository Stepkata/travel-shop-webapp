import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Cart } from '../../structures/cart';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
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
