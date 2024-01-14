import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryItem } from '../../structures/history-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  history: HistoryItem[] = [];
  oncoming:boolean = false;
  isLoading: boolean = true;
  comingStart: string = "";
  comingName: string = "";
  
  constructor(private DataService: DataService) { 
  }

  ngOnInit(): void {
    this.DataService.history$.subscribe((data) => {
      if (data == null)
        console.log("null!");
      this.history = data;
      this.checkTripNotif();
      this.isLoading = false;
    });
  }

  checkTripNotif(){
    for (const item of this.history){
      const startDate = new Date(item.startDate);
      const currentDate = new Date();
      const timeDifference = startDate.getTime() - currentDate.getTime();

      // Convert milliseconds to days
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      // Check if the difference is less than 4 days
      if (daysDifference > 0 && daysDifference < 4){
        this.oncoming = true;
        this.comingName = item.Name;
        this.comingStart = item.startDate;
        return;
      }
    }
    this.oncoming = false;
  }

}
