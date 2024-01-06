import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryItem } from '../../structures/history-item';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{
  history: HistoryItem[] = [];
  starCount: number = 5;
  ratingArr:any = [];

  constructor(private DataService: DataService, private modalService: NgbModal) { 
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
    console.log("oninit!");
  }

  getState(item: HistoryItem){
    const startDate = new Date(item.Trip.DataRozpoczecia);
    const endDate = new Date(item.Trip.DataZakonczenia);
    const currentDate = new Date();

    if (currentDate < startDate)
      return 0;
    else if (currentDate > endDate)
      return 2;
    else 
      return 1;
  }

}
