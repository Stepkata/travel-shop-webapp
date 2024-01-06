import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(tours: Wycieczka[] , minInclusive: Date | null, maxInclusive: Date | null): Wycieczka[] {
    if(!tours)
      return [];
    if(!minInclusive || !maxInclusive)
      return tours;
    return tours.filter(tour => {
      console.log(minInclusive);
      console.log(maxInclusive);
      console.log(new Date(tour.DataRozpoczecia));
      console.log(new Date(tour.DataZakonczenia));
      return new Date(tour.DataRozpoczecia)>= minInclusive && new Date(tour.DataZakonczenia) <= maxInclusive;
    });
}

}
