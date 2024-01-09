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
  isLoading: boolean = true;

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
      this.isLoading = false;
    });
  }

  getState(item: HistoryItem){
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const currentDate = new Date();

    if (currentDate < startDate)
      return 0;
    else if (currentDate > endDate)
      return 2;
    else 
      return 1;
  }

  toggleFilterState(state: number) {
    this.filterState = this.filterState === state ? null : state;
  }

  getFormatedDate(timestamp: any){
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

}
