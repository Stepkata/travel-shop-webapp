export interface Review {
    tripId: number;
    userId: number;
    nick: string;
    name: string;
    rating: number;
    reviewText: string;
    purchaseDate?: Date;
  }