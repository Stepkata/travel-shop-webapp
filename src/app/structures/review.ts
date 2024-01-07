export interface Review {
    tripId: number;
    userId: number;
    nick: string;
    name: string;
    reviewText: string;
    purchaseDate?: Date;
  }