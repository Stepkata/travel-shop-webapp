import { Wycieczka } from "./wycieczka.model";

export interface HistoryItem {
    TripId: number;
    Amount: number;
    Total: number;
    dateSold: Date;
}
