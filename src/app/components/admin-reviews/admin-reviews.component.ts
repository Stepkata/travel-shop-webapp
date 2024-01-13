import { Component, OnInit } from '@angular/core';
import { Review } from '../../structures/review';
import { DataService } from '../../services/data.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-admin-reviews',
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css'
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  isLoading = true;

  constructor(private DataService: DataService, private AccountService: AccountService){}

  ngOnInit(): void {
    this.DataService.reviews$.subscribe((data) => {
      if (data != null){
        this.reviews = data;
      }
      this.isLoading = false;
    });
  }

  removeReview(tripId: number, userId:string){
    this.DataService.deleteReview(tripId, userId);

  }

  banAuthor(userId: string){
    this.AccountService.ban(userId);
  }

  getFormatedDate(timestamp: any){
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

}
