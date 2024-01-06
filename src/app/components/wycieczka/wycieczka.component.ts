import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Wycieczka } from '../../structures/wycieczka.model';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-wycieczka',
  templateUrl: './wycieczka.component.html',
  styleUrl: './wycieczka.component.css'
})
export class WycieczkaComponent implements OnInit{
  wycieczka: any;
  private tripId: number = 0;
  reserved: Map<Wycieczka, number> = new Map();
  bought: Map<Wycieczka, number> = new Map();
  trips: Wycieczka[] = [];

  rating: number = 0;
  starCount: number = 5;
  ratingArr:any = [];

  constructor(private DataService: DataService, private route: ActivatedRoute) { 
    console.log("wycieczka constructor!");
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tripId = parseInt(params.get('id')!);
    });

    this.DataService.trips$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      else
        this.trips = data;
    });
    for (const w of this.trips){
      if (w.Id == this.tripId){
        this.wycieczka = w;
      }
    }

    if (this.wycieczka)
      this.rating = this.getRating();
    this.DataService.reserved$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.reserved = data;
    })
    this.DataService.bought$.subscribe((data) => {
      if (data != null){
        this.bought = data;
      }
    })
  }

  reservePlace(wycieczka: Wycieczka): void {
    if ( this.reserved.get(wycieczka)! + this.bought.get(wycieczka)! < wycieczka.MaxIloscMiejsc){
      this.reserved.set(wycieczka, this.reserved.get(wycieczka)! + 1);
      this.DataService.updateReserved(this.reserved);
    }

  }

  cancelReservation(wycieczka: Wycieczka): void {
    if ( this.reserved.get(wycieczka)!> 0) {
        this.reserved.set(wycieczka, this.reserved.get(wycieczka)! - 1);
      this.DataService.updateReserved(this.reserved);
    }
  }

  getRating(): number{
    if (!this.wycieczka.Rating)
      return 0;
    let sum = 0;
    for (const r of this.wycieczka.Rating){
      sum += r;
    }
    return sum/this.wycieczka.Rating.length;
  }

  onClick(rating:number) {
    console.log(rating)
    this.rating = rating;
    this.wycieczka.Rating.push(this.rating);
    this.trips[this.tripId-1] = this.wycieczka;
    this.DataService.updateTrips(this.trips);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }


}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
