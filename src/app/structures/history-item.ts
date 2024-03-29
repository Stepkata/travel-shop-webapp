import { Wycieczka } from "./wycieczka.model";

export interface HistoryItem {
    TripId: number;
    UserId: string;
    Amount: number;
    Total: number;
    Name: string;
    Country: string;
    Description: string;
    dateSold: Date;
    startDate: string;
    endDate: string;
}
