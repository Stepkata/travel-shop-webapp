import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(tours: Wycieczka[] , minInclusive: Date | null, maxInclusive: Date | null): Wycieczka[] {
    if(!tours)
      return [];
    if (!minInclusive && !maxInclusive){
      return tours;
    }
    if(!minInclusive ){
      return tours.filter(tour => {
        return new Date(tour.DataZakonczenia) <= maxInclusive!;
      });
    }
    if ( !maxInclusive){
      return tours.filter(tour => {
        return new Date(tour.DataRozpoczecia)>= minInclusive!;
      });
    }else{
      return tours.filter(tour => {
        return new Date(tour.DataRozpoczecia)>= minInclusive! && new Date(tour.DataZakonczenia) <= maxInclusive!;
      });
    }
}

}
