import { Wycieczka } from "./wycieczka.model";

export interface HistoryItem {
    Trip: Wycieczka;
    Amount: number;
    Total: number;
    dateSold: Date;
}
