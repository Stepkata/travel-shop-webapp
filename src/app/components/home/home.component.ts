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
  }

}
