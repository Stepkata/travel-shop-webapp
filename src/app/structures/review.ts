export interface Review {
    tripId: number;
    userId: string;
    nick: string;
    name: string;
    rating: number;
    reviewText: string;
    purchaseDate?: Date;
  }