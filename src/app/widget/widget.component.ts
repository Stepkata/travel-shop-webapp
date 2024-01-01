import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Wycieczka } from '../wycieczka.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css'
})
export class WidgetComponent {
  reserved: Wycieczka[] = [];
  reservedMap: Map<Wycieczka, number> = new Map<any, number>;
  num_reserved: number = 0;
  total: number = 0;

  constructor( private DataService: DataService) { 
    }

  ngOnInit() {
    this.DataService.reserved$.subscribe((data) => {
      if (data != null){
        this.total = 0;
        this.reserved = [];
        this.reservedMap = data;
        for (const [wycieczka, ilosc] of data) {
          if (ilosc != 0){
            this.total += ilosc * wycieczka.CenaJednostkowa;
            this.reserved.push(wycieczka);
          }
        }
      }
    });
  }

}
