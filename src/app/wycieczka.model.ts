export interface Wycieczka {
    Id: number;
    Nazwa: string;
    Kraj: string;
    DataRozpoczecia: string;
    DataZakonczenia: string;
    CenaJednostkowa: number;
    MaxIloscMiejsc: number;
    Opis: string;
    Zdjecie: string;
    Rating: number[];
  }