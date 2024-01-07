import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Wycieczka } from '../../structures/wycieczka.model';
import { HistoryItem } from '../../structures/history-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  history: HistoryItem[] = [];
  oncoming:boolean = false;
  
  constructor(private DataService: DataService, private modalService: NgbModal) { 
  }

  ngOnInit(): void {
    this.DataService.history$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.history = data;
    });
    setInterval(() => {
      this.tripOncoming();
    }, 10);
  }

  tripOncoming(): void {
    if (!this.history || this.history.length === 0){
      this.oncoming =  false;
      return
    }
    for (const item of this.history){
      const startDate = new Date(item.Trip.DataRozpoczecia);
      const currentDate = new Date();
      const timeDifference = startDate.getTime() - currentDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      // Check if the trip is oncoming (within the next 5 days)
      if (daysDifference >= 0 && daysDifference <= 5) {
        this.oncoming = true;
      }
    }
    this.oncoming = false;
  }
}
