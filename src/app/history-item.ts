import { Wycieczka } from "./wycieczka.model";

export interface HistoryItem {
    Trip: Wycieczka;
    Amount: number;
    dateSold: Date;
}
