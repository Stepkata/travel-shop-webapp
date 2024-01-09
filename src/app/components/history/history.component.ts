import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HistoryItem } from '../../structures/history-item';
import { HistoryStatePipe } from '../../pipes/history-state.pipe';
import { Wycieczka } from '../../structures/wycieczka.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [ HistoryStatePipe ]
})
export class HistoryComponent implements OnInit{
  history: HistoryItem[] = [];
  trips: Wycieczka[] = [];
  starCount: number = 5;
  ratingArr:any = [];
  filterState: number | null = null;

  constructor(private DataService: DataService) { 
    console.log("constructor!");
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngOnInit(): void {
    this.DataService.history$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.history = data;
    });
    this.DataService.trips$.subscribe((data) => {
      if (data != null)
        this.trips = data;
    });
    console.log("oninit!");
  }

  getState(item: HistoryItem){
    const startDate = new Date(this.getTrip(item).DataRozpoczecia);
    const endDate = new Date(this.getTrip(item).DataZakonczenia);
    const currentDate = new Date();

    if (currentDate < startDate)
      return 0;
    else if (currentDate > endDate)
      return 2;
    else 
      return 1;
  }

  getTrip(item: HistoryItem): Wycieczka{
    return this.trips.find(i => i.Id === item.TripId)!
  }

  toggleFilterState(state: number) {
    this.filterState = this.filterState === state ? null : state;
  }

}
