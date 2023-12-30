import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
    reserved: any;
    num_reserved: number = 0;

    constructor( private DataService: DataService) { 
    }

    ngOnInit() {
    this.DataService.reserved$.subscribe((data) => {
      this.reserved = data;
      if (data != null)
        this.num_reserved = data.size;
    });
  }
}
