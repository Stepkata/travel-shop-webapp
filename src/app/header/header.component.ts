import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
    reserved: any;
    num_reserved: number = 0;
    public colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

    constructor( private DataService: DataService) { 
    }

    ngOnInit() {
    this.DataService.reserved$.subscribe((data) => {
      this.reserved = data;
      this.num_reserved = 0;
      if (data != null)
        for (const [wycieczka, ilosc] of data) {
          if (ilosc != 0){
            this.num_reserved += 1;
          }
        }
    });
  }

}
